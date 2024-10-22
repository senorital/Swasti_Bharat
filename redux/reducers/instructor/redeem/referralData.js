import {
  GET_BANK_VERIFICATION,
  GET_CHAKRA,
  GET_REFERRAL_DATA,
} from "../../../constants/instructor/actionTypes";

const initialState = {
  chakras: [],
  referrals: [],
  bankVerification: null,
  loading: false,
  error: null,
};

const redeemReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_CHAKRA:
      return {
        ...state,
        chakras: action.payload,
      };
    case GET_REFERRAL_DATA:
      return {
        ...state,
        referrals: action.payload || [], // Handle the case where payload might be undefined
      };
  
    default:
      return state;
  }
};

export default redeemReducer;
