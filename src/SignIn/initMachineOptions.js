import { assign } from "xstate";
import { isEmail } from "validator";
import { signIn } from "./authService";

const initMachineOptions = (
  handleEmailInputFocus,
  handlePasswordInputFocus,
  handleSubmitButtonFocus
) => ({
  guards: {
    isNoEmail: (context, event) => context.email.length === 0,
    isEmailBadFormat: (context, event) =>
      context.email.length > 0 && !isEmail(context.email),
    isNoPassword: (context, event) => context.password.length === 0,
    isPasswordShort: (context, event) => context.password.length < 5,
    isNoAccount: (context, evt) => evt.data.code === 1,
    isIncorrectPassword: (context, evt) => evt.data.code === 2,
    isNoResponse: (context, evt) => evt.data.code === 3,
    isInternalServerErr: (context, evt) => evt.data.code === 4
  },
  services: {
    requestSignIn: (context, event) => signIn(context.email, context.password)
  },
  actions: {
    focusEmailInput: handleEmailInputFocus,
    focusPasswordInput: handlePasswordInputFocus,
    focusSubmitBtn: handleSubmitButtonFocus,
    cacheEmail: assign((context, event) => ({
      email: event.email
    })),
    cachePassword: assign((context, event) => ({
      password: event.password
    })),
    onSuccess: () => {
      alert("signed in");
    }
  }
});

export default initMachineOptions;
