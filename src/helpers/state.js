import moment from 'moment-timezone';

const devState = ['ACCOUNT_ACTIVATE', 'ACCOUNT_PAYMENT', 'POS_SELECTION', 'SETUP_PROFILE', 'ACCOUNT_COMPLETE'];

export const _verifyState = (merchantAccount, state = devState, body) => {
  const previousState = merchantAccount.get('accountState');
  console.log('HIHI', previousState);
  switch (previousState) {
    case 'ACCOUNT_ACTIVATE':
      console.log('Case account activate');
      break;

    case 'ACCOUNT_PAYMENT':
      console.log('Case account payment');
      
      merchantAccount.set({
        serviceType: body.plan,
        paymentDetail: { paymentID: body.paymentId },
        isPaymentCompleted: true,
        paymentCompletedAt: Number(moment().format('X')),
      });
      break;

    case 'POS_SELECTION':
      console.log('Case pos selection');
      merchantAccount.set({
        posSelected: true,
      });
      break;

    case 'SETUP_PROFILE':
      console.log('Case setting profile');
      break;

    case 'SETUP_NEWSLETTER':
      console.log('Case setting newsletter');
      break;

    case 'SETUP_RECOGNITION':
      console.log('Case setting recognition');
      break;
  }
  console.log('incrementing stage');
  const index = state.indexOf(previousState);
  const stage = state[index + 1];
  console.log('adding accountDetail of changes', stage);
  merchantAccount.add('accountDetail', {
    previousState,
    newState: stage,
    time: Number(moment().format('X')),
  });
  merchantAccount.set('accountState', stage);
  console.log('Set accounDetail: ', merchantAccount);
  return merchantAccount;
};
