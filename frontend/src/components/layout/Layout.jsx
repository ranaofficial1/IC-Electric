import { Outlet } from "react-router-dom";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="w-full pt-[120px] bg-background min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
