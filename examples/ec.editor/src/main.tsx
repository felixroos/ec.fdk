import * as axaPackage from "@axa-fr/oidc-client/package.json";
import { OidcProvider, OidcSecure } from "@axa-fr/react-oidc";
import React from "react";
import ReactDOM from "react-dom/client";
import { PageLoader } from "./components/PageLoader.tsx";
import "./index.css";

import { RouterProvider, createRouter } from "@tanstack/react-router";

import { routeTree } from "./routeTree.gen";
const router = createRouter({ routeTree });
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const environment = import.meta.env;

const configuration = {
  client_id: environment.VITE_CLIENT_ID,
  redirect_uri: environment.VITE_REDIRECT_URI,
  silent_redirect_uri: environment.VITE_SILENT_REDIRECT_URI,
  scope: "openid profile email ecapi offline_access",
  authority: environment.VITE_AUTHORITY,
  demonstrating_proof_of_possession: false,
  service_worker_relative_url: `/OidcServiceWorker.js?v=${axaPackage.version}`,
  service_worker_only: true,
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <OidcProvider
      configuration={configuration}
      loadingComponent={PageLoader}
      authenticatingComponent={PageLoader}
      callbackSuccessComponent={PageLoader}
    >
      <OidcSecure>
        <RouterProvider router={router} />
      </OidcSecure>
    </OidcProvider>
  </React.StrictMode>
);
