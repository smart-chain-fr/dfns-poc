# Welcome to the Dfns WebAuthn Demo App

Dfns aims to create the most secure and programmatic wallet-as-a-service platform in web3. We want to make it easy for all developers, blockchain-savvy or not, to build Web3 products with great user experiences and onboard the next billion users swiftly, without compromising on security.

The question is how can we create a balance between usability and security, enabling millions of developers to create blockchain-based apps for billions of users? The solution is combining a seamless UX with a decentralized key management network, removing the notion of seed phrases entirely from onboarding.

To streamline the user experience, we leverage [WebAuthn](webauthn.guide) to access secrets stored in the secure enclave of the user's device. This architecture enables "Delegated Signing" in which users sign challenges to access to our API with a secret only available to them, ensuring self-custody.

## Overview of the Demo App

This demo application showcases one of the simplest flows possible using this stack. It's built on Next.js in React. Here's a diagram of the architecture:

<br>
<img src="public/demoapp.png" alt="Demo App Architecture"/>
<br>

The application runs on a dedicated Dfns Demo org in our multi-tenant platform. The organization is configured with an Application that specifies "http://localhost:3000" as the Origin so the app can be run locally. Additionally, an API key was created and the secret key stored in a .env file along with the JWT access token which are used for server side requests.

The user registers for the demo app via the [RegisterForm](https://github.com/dfnsext/authv2-demo-app/blob/m/src/components/RegisterForm/RegisterForm.tsx) component. This calls the [delegatedRegistration](https://github.com/dfnsext/authv2-demo-app/blob/m/src/utils/sendApiRequest.ts#L46) from the server side signing with the API Key secret. The user is then prompted to establish their WebAuthn credentials which are written to the secure enclave of their device.

The user logs into the app via the [LoginForm](https://github.com/dfnsext/authv2-demo-app/blob/m/src/components/LoginForm/LoginForm.tsx). This in turn calls [delegatedLogin](https://github.com/dfnsext/authv2-demo-app/blob/m/src/utils/sendApiRequest.ts#L19) to establish the user session. Note Dfns is agnostic to your application's authentication scheme, so we have not implemented any real application auth for the demo.

After logging in, the user should have an access_key written to local storage in JWT format. All application level functionality which triggers a POST requests uses this access key as a bearer token and signs the request with the WebAuthn secret. For example, when the user [creates a wallet](https://github.com/dfnsext/authv2-demo-app/blob/m/src/pages/index.tsx#L30), the [signedRequest](https://github.com/dfnsext/authv2-demo-app/blob/m/src/utils/signedRequest.ts#L9) method makes the necessary calls to obtain a challenge, sign it, and pass the resulting [x-dfns-useraction](https://github.com/dfnsext/authv2-demo-app/blob/m/src/utils/signedRequest.ts#L68) header to the Dfns API. A similar flow is triggered for the transfer.

We welcome your feedback and questions on the demo app. Don't hesitate to reach out to us at docs@dfns.co. Thanks!
