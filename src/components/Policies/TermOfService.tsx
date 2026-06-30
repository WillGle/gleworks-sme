// Terms of service section rendered inside the policies page.
import React from "react";

const TermOfService: React.FC = () => {
  return (
    <section id="term-of-service" className="policy-section">
      <h1>Term of Service</h1>
      <p>
        Please read these terms carefully before using this website. By
        accessing this site or placing an order with GLEWORKS, you confirm your
        acceptance of the terms below. If you do not agree with them, please do
        not use this website.
      </p>
      <h3>General</h3>
      <p>
        We may update these terms from time to time. Your continued use of the
        site after a change means you accept the updated terms. We may also
        change, add, or remove parts of the site at any time, with or without
        prior notice.
      </p>
      <h3>Site Contents</h3>
      <p>
        Unless otherwise stated, all materials on this site — including images,
        designs, logos, and text — belong to GLEWORKS and are intended for your
        personal, non-commercial use. You may not copy, reproduce, or
        redistribute any part of the site without our written permission.
      </p>
      <h3>Products &amp; Services</h3>
      <p>
        We provide custom keyboard building and switch modding services. We aim
        to describe every service and product as accurately as possible, but we
        do not guarantee that all details are error-free. Prices and
        availability may change without notice, and we reserve the right to
        refuse or cancel any order at our discretion.
      </p>
    </section>
  );
};

export default TermOfService;
