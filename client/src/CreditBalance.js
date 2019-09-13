import React from 'react';

function CreditBalance({ myAccount }) {


  return (
    <div className="CreditBalance tab-content">
      <h1>My Account</h1>
      <p>{myAccount.first_name} {myAccount.last_name}</p>
      <p>Balance: ${myAccount.balance}.00</p>
    </div>
  );
}

export default CreditBalance;
