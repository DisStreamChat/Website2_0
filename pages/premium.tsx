import admin from "../firebase/admin";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Main } from "../components/shared/styles";
import firebaseClient from "../firebase/client";
import { useAuth } from "../auth/authContext";
import { loadStripe } from "@stripe/stripe-js";

enum PriceType {
    ONE_TIME = "one_time",
    RECURRING = "recurring",
}

interface Price {
    active: boolean;
    interval: string;
    type: PriceType;
    cost: number;
    id: string;
}

interface Product {
    name: string;
    active?: boolean;
    description?: string;
    prices: Price[];
}

const PremiumMain = styled(Main)`
    padding: 6rem 3rem;
`;

const ProductContainer = styled.div`
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    justify-content: center;
`;

const PriceCard = styled.div`
    padding: 1rem 2rem;
    border-radius: 0.25rem;
    background: var(--disstreamchat-blue);
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PriceTypeToTitleMap = {
    [PriceType.ONE_TIME]: "Lifetime plan",
    month: "1-month plan",
    year: "1-year plan",
};

const PriceTitle = styled.h1`
    font-weight: bold;
`;

const PriceDisplay = styled.h2`
    font-weight: bold;
    font-size: 1.25rem;
`;

const Premium = ({ products }) => {
    const { user } = useAuth();

    const purchasePlan = async (price) => {
        const docRef = await firebaseClient.db
            .collection("customers")
            .doc(user.uid)
            .collection("checkout_sessions")
            .add({
                price: price.id,
                success_url: window.location.origin,
                cancel_url: window.location.origin,
            });
        // Wait for the CheckoutSession to get attached by the extension
        docRef.onSnapshot(async (snap) => {
            const { error, sessionId } = snap.data();
            if (error) {
                // Show an error to your customer and
                // inspect your Cloud Function logs in the Firebase console.
                alert(`An error occured: ${error.message}`);
            }
            if (sessionId) {
                // We have a session, let's redirect to Checkout
                // Init Stripe
                const stripe = await loadStripe(
                    process.env.NEXT_PUBLIC_STRIPE_KEY
                );
                stripe.redirectToCheckout({ sessionId });
            }
        });
    };

    return (
        <PremiumMain>
            <ProductContainer>
                {products.map((product) =>
                    product.prices.map((price) => (
                        <PriceCard>
                            <PriceTitle>
                                {price.type === PriceType.ONE_TIME
                                    ? PriceTypeToTitleMap[price.type]
                                    : PriceTypeToTitleMap[price.interval]}
                            </PriceTitle>
                            <PriceDisplay>${price.cost / 100}</PriceDisplay>
                            <div>
                                {price.type === PriceType.ONE_TIME
                                    ? "single payment"
                                    : "per month"}
                            </div>
                            <button onClick={() => purchasePlan(price)}>
                                Get{" "}
                                {price.type === PriceType.ONE_TIME
                                    ? PriceTypeToTitleMap[price.type]
                                    : PriceTypeToTitleMap[price.interval]}
                            </button>
                        </PriceCard>
                    ))
                )}
            </ProductContainer>
        </PremiumMain>
    );
};

export const getServerSideProps = async () => {
    const collectionRef = await admin.firestore().collection("products").get();
    const docs = collectionRef.docs;
    let products: Product[] = [];
    for (const doc of docs) {
        const data = doc.data();
        if (!data || !data.active) continue;
        const pricesRef = await doc.ref.collection("prices").get();
        const priceDocs = pricesRef.docs;
        const prices: Price[] = priceDocs
            .map((doc) => ({ id: doc.id, ...doc.data() }))
            .map((price: any) => ({
                active: price.active,
                interval: price.interval,
                type: price.type,
                cost: price.unit_amount,
                id: price.id,
            }));
        products.push({
            name: data.name,
            description: data.description,
            prices: prices.sort((a, b) => a.type.localeCompare(b.type)),
        });
    }
    return { props: { products } };
};

export default Premium;
