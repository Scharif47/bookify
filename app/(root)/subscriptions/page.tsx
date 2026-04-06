import { PricingTable } from "@clerk/nextjs";

const SubscriptionsPage = () => {
  return (
    <div className="clerk-subscriptions">
      <div className="mb-10 text-center">
        <h1 className="page-title">Choose Your Plan</h1>
        <p className="page-description text-(--text-secondary)">
          Unlock more books, sessions, and longer conversations.
        </p>
      </div>

      <div className="w-full max-w-5xl">
        <PricingTable />
      </div>
    </div>
  );
};

export default SubscriptionsPage;
