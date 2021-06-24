import React, { useState } from "react";
import admin from "../firebase/admin";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Main } from "../components/shared/styles";
import firebaseClient from "../firebase/client";
import { useAuth } from "../auth/authContext";
import { loadStripe } from "@stripe/stripe-js";
import {
    EmptyButton,
    GreenButton,
    OrangeButton,
} from "../components/shared/ui-components/Button";

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
    padding-top: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: calc(100vh - var(--header-height));
    h1 {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 3rem;
    }
`;

const ProductContainer = styled.div`
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    justify-content: center;
    background: #1d1e22;
    padding: 4rem 2rem;
    height: 100%;
    flex: 1;
    z-index: 2;
    margin-bottom: 2rem;
    /* align-items: stretch; */
`;

const PriceCard = styled.div`
    padding: 1rem 2rem;
    border-radius: 0.25rem;
    background: var(--disstreamchat-blue);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;
`;

const PriceTypeToTitleMap = {
    [PriceType.ONE_TIME]: "Lifetime plan",
    month: "1-month plan",
    year: "1-year plan",
};

const PriceTitle = styled.h2`
    font-weight: bold;
    margin-bottom: 1rem;
`;

const PriceDisplay = styled.h3`
    font-weight: 600;
    font-size: 3.25rem;
    &:before {
        content: "$";
    }
`;

const ProductsSelector = styled.div`
    display: flex;
    transform: translateY(3px);
`;

const ProductSelection = styled.div`
    &.active {
        background: #1d1e22;
        box-shadow: 0px 0px 15px 0px #000000;
    }
    padding: 2rem;
    border-radius: 1rem 1rem 0 0;
`;

const PerksContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Perks = styled.ul`
    border: solid;
    width: 60vw;
`;

const PerkItem = styled.li`
    border: 1px solid;
`;

const PriceSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const PaymentType = styled.div`
    transform: translateY(-1rem);
    opacity: 0.7;
`;

const intervalMap = {
    month: 1,
    year: 12,
};

const dollarify = (cost: string | number): string => {
    if (typeof cost === "number") cost = `${cost}`;
    const split = cost.split(".");
    const dollars = split[0];
    const cents = split[1];
    return `${dollars}.${cents.slice(0, 2)}`;
};

const BottomDollar = styled.div`
    color: rgba(255, 255, 255, 0.7);
    margin-top: 0.25rem;
    font-size: 90%;
`;

const Premium = ({ products }) => {
    const { user } = useAuth();
    const [selectedProduct, setSelectedProduct] = useState<Product>(
        products[0]
    );

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
            <h1>DisStreamChat Premium</h1>
            <ProductsSelector>
                {products.map((product) => (
                    <EmptyButton onClick={() => setSelectedProduct(product)}>
                        <ProductSelection
                            className={`${
                                selectedProduct.name === product.name
                                    ? "active"
                                    : ""
                            }`}
                        >
                            {product.name}
                        </ProductSelection>
                    </EmptyButton>
                ))}
            </ProductsSelector>
            <ProductContainer>
                {selectedProduct?.prices?.map((price) => (
                    <PriceCard key={price.id}>
                        <PriceSection>
                            <PriceTitle>
                                {price.type === PriceType.ONE_TIME
                                    ? PriceTypeToTitleMap[price.type]
                                    : PriceTypeToTitleMap[price.interval]}
                            </PriceTitle>
                            <PriceDisplay>
                                {dollarify(
                                    price.cost /
                                        100 /
                                        (price.interval
                                            ? intervalMap[price.interval]
                                            : 1)
                                )}
                            </PriceDisplay>
                            <PaymentType>
                                {price.type === PriceType.ONE_TIME
                                    ? "single payment"
                                    : "per month"}
                            </PaymentType>
                        </PriceSection>
                        <PriceSection>
                            <OrangeButton onClick={() => purchasePlan(price)}>
                                Get{" "}
                                {price.type === PriceType.ONE_TIME
                                    ? PriceTypeToTitleMap[price.type]
                                    : PriceTypeToTitleMap[price.interval]}
                            </OrangeButton>
                            <BottomDollar>
                                {price.interval
                                    ? `$${price.cost / 100} billed every ${
                                          price.interval
                                      }`
                                    : `$${price.cost / 100} paid only once`}
                            </BottomDollar>
                        </PriceSection>
                    </PriceCard>
                ))}
            </ProductContainer>
            <PerksContainer>
                <h1>Premium Perks</h1>
                <Perks>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                    <PerkItem>
                        <div></div>
                        <div></div>
                        <div></div>
                    </PerkItem>
                </Perks>
            </PerksContainer>
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
