import axios from "axios";
import { loginStart, loginSuccess, logout } from "./slice";

export const checkAuth = () => async (dispatch) => {
  dispatch(loginStart());

  try {
    const res = await axios.get(
      "http://localhost:5000/user/me",
      { withCredentials: true }
    );

    dispatch(loginSuccess(res.data.user));
  } catch {
    dispatch(logout());
  }
};
