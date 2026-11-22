import React from 'react';
import { ArrowLeft } from 'lucide-react';
import './LegalPage.css';

const policies = {
  'privacy-policy': {
    title: 'Privacy Policy',
    intro: 'This page describes personal information the Flatkart application uses to provide account, shopping, order and support features.',
    sections: [
      ['Information used in the app', 'Account features use your name, email address and, where provided, mobile number. Checkout uses recipient, mobile number and delivery-address details. The app also stores account addresses, cart and order details, payment status, and information submitted with complaints or return requests.'],
      ['How information is used', 'These details support sign-in, account management, delivery serviceability checks, order placement and status, payment verification, and customer complaint or return workflows.'],
      ['Payments', 'The checkout currently offers Cash on Delivery where available, and may offer UPI or Net Banking through Razorpay. Razorpay collects and processes online payment details. The checkout states that Flatkart does not receive your UPI or banking details.'],
      ['Access and account controls', 'Account and order features are tied to the signed-in customer. You can manage profile details, saved addresses and password from My Account.'],
      ['Details to confirm', 'The application does not establish a complete privacy notice covering the legal business identity, data-retention periods, deletion requests, analytics or cookie practices, or a privacy contact. These details require confirmation before they can be stated as policy.'],
    ],
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    intro: 'These application notes describe how shopping and account features currently work. They do not replace business terms that have not been established in the application.',
    sections: [
      ['Accounts', 'Some account, order, checkout and complaint features require sign-in. Keep account credentials private; the application supports updating your password from My Account.'],
      ['Products and orders', 'Product availability and options are shown in the catalogue. Prices are confirmed at checkout. An order is placed through Cash on Delivery where available or after the selected online payment is verified.'],
      ['Delivery details', 'Checkout collects a delivery address and checks it against current serviceability records before an order is placed. Shipment status and an estimated delivery date may be shown when available for an order.'],
      ['Details to confirm', 'The application does not define full sale terms, order acceptance and cancellation rules, liability terms, governing law, or a business identity. These require confirmation by the business owner.'],
    ],
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    intro: 'Delivery is available only where the checkout serviceability check accepts the provided PIN code and order.',
    sections: [
      ['Address and serviceability', 'Checkout requests recipient, mobile number and delivery-address details. The address is checked against current serviceability records before an order is placed.'],
      ['Charges and timing', 'Checkout displays the order total before placement. The current checkout note says no shipping fee or discount has been added to the displayed total. The application does not establish delivery coverage beyond its serviceability check, delivery timelines, carrier details or a general shipping charge policy.'],
      ['Tracking', 'Order and shipment status may be available in the customer order area. An estimated delivery date is shown only when one is recorded for that shipment.'],
      ['Details to confirm', 'The business owner needs to confirm shipping charges, delivery timelines, dispatch practices, service areas and how delivery issues are handled before fixed commitments are published.'],
    ],
  },
  'returns-and-refunds': {
    title: 'Returns & Refunds',
    intro: 'The application supports return requests for eligible order items. Eligibility and available resolution depend on the order and product information recorded in the system.',
    sections: [
      ['Requesting a return', 'Signed-in customers can submit a return request for an order item, choose a reason and request a refund or replacement. A request may include a description and supporting evidence.'],
      ['Eligibility and review', 'Return eligibility uses product returnability and return-window information recorded for the item and its order. The application does not set one universal return window. Requests follow a review workflow, and their status is shown with the order or return request.'],
      ['Refunds', 'Refunds are recorded with statuses such as pending, processing, processed or failed. A refund or replacement is not promised until the request or relevant order action is approved and processed. No processing-time commitment is established in the application.'],
      ['Details to confirm', 'The business owner needs to confirm item-condition requirements, exclusions, return shipping responsibility, request deadlines, cancellation rules and refund timelines. Check the product and order details for recorded eligibility.'],
    ],
  },
};

export function LegalPage({ page, onNavigate }) {
  const policy = policies[page] || policies['privacy-policy'];

  return (
    <main className="fk-legal-page">
      <div className="fk-legal-content">
        <button className="fk-legal-back" type="button" onClick={() => onNavigate('home')}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to Flatkart
        </button>
        <article>
          <p className="fk-legal-eyebrow">FLATKART INFORMATION</p>
          <h1>{policy.title}</h1>
          <p className="fk-legal-intro">{policy.intro}</p>
          {policy.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2>{heading}</h2>
              <p>{body}</p>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}

export default LegalPage;
