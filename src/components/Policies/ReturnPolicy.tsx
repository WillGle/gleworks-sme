// Return policy section rendered inside the policies page.
import React from "react";

const ReturnPolicy: React.FC = () => {
  return (
    <section id="return-policy" className="policy-section">
      <h1>Return Policy</h1>
      <p>
        We want you to be happy with your order. If something is not right,
        please review the conditions below before requesting a return.
      </p>
      <h3>Eligibility</h3>
      <p>
        You may request a return within 7 days of receiving your order, provided
        the item is unused and in its original condition and packaging.
        Custom-built keyboards and modded switches are made to order and cannot
        be returned unless they arrive damaged or defective.
      </p>
      <h3>How to Request a Return</h3>
      <p>
        To start a return, contact us at support@gleworks.io.vn with your order
        number and a short description of the issue. Our team will guide you
        through the next steps.
      </p>
      <h3>Refunds</h3>
      <p>
        Once we receive and inspect your returned item, we will let you know the
        status of your refund. Approved refunds are issued to your original
        payment method.
      </p>
    </section>
  );
};

export default ReturnPolicy;
