import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";

export const metadata = {
  title: "Terms of Service — GSAB",
  description: "The terms governing use of the GSAB software and website.",
};

export default function Terms() {
  return (
    <>
      <SiteHeader />
      <main className="docs">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <header className="docs__hero">
            <span className="eyebrow">Legal</span>
            <h1 className="display">Terms of Service</h1>
            <p>Last updated: 23 June 2026</p>
          </header>

          <section className="doc-sec">
            <h2>Acceptance</h2>
            <p>
              By using the GSAB software or this website, you agree to these terms. If you do not
              agree, do not use them.
            </p>
          </section>

          <section className="doc-sec">
            <h2>The software & license</h2>
            <p>
              GSAB is open-source software provided under the MIT License. It is provided “as
              is”, without warranty of any kind, express or implied. See the LICENSE file in the
              repository for the full text.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Your responsibilities</h2>
            <p>
              You are responsible for your use of your own Google Account, for complying with
              Google's terms of service and applicable laws, and for the data you store in your
              spreadsheets.
            </p>
          </section>

          <section className="doc-sec">
            <h2>No affiliation</h2>
            <p>
              GSAB is an independent project and is not affiliated with, endorsed by, or
              sponsored by Google LLC. “Google Sheets” and “Google Drive” are trademarks of
              Google LLC.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, the authors and contributors are not liable
              for any damages arising from use of the software or website.
            </p>
          </section>

          <section className="doc-sec">
            <h2>Changes & contact</h2>
            <p>
              We may update these terms; continued use constitutes acceptance. Questions:{" "}
              <a href="mailto:ajmalaksar25@gmail.com">ajmalaksar25@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
