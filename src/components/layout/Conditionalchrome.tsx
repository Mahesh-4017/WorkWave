"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// Routes that should render without the site header/footer
const NO_CHROME_ROUTES = ["/login", "/signup", "/register", "/reset", "/dashboard"];

export default function ConditionalChrome({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const hideChrome = NO_CHROME_ROUTES.some((route) => pathname?.startsWith(route));

    if (hideChrome) {
        return <div className="flex-1 flex flex-col">{children}</div>;
    }

    return (
        <>
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
        </>
    );
}