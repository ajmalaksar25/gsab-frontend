import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: "Privacy Policy — GSAB",
  description: "How the GSAB software and website handle your data.",
};

export default function Privacy() {
  return (
    <>
      <SiteHeader />
      <main className="docs">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <header className="docs__hero">
            <span className="eyebrow">Legal</span>
            <h1 className="display">Privacy Policy</h1>
            <p>Last updated: 23 June 2026</p>
          </header>

          <section className="doc-sec">
            <h2>Overview</h2>
            <p>
              GSAB is an open-source Python library and command-line tool for using Google
              Sheets as a backend. This policy explains what data the GSAB software and this
              website handle.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Your Google data</h2>
            <p>
              When you authorize GSAB with your Google Account, it requests the{" "}
              <code>drive.file</code> scope by default. This grants access only to the Google
              Sheets and files you create or explicitly open with GSAB — never your entire
              Google Drive. The optional <code>--full</code> mode requests broader scopes; use it
              only if you intend GSAB to reach your existing sheets. GSAB reads and writes your
              data only as you direct it.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Where credentials are stored</h2>
            <p>
              GSAB stores your OAuth token locally on your own device, in your operating
              system's standard configuration directory. The GSAB library does not run a server
              and does not transmit your tokens or sheet data to us or any third party — your
              data flows directly between your machine and Google's APIs.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Google API Services User Data Policy</h2>
            <p>
              GSAB's use and transfer of information received from Google APIs adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noreferrer"
              >
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section className="doc-sec">
            <h2>This website</h2>
            <p>
              gsab.ajmalaksar.com is a static informational site. It does not require an account
              and does not collect personal information through forms. Our hosting provider may
              process standard technical request logs (such as IP address and user agent) for
              security and operation.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Sharing & sale</h2>
            <p>We do not sell your data, and we do not share your Google data with third parties.</p>
          </section>

          <section className="doc-sec">
            <h2>Changes & contact</h2>
            <p>
              We may update this policy; the date above will change accordingly. Questions:{" "}
              <a href="mailto:ajmalaksar25@gmail.com">ajmalaksar25@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
