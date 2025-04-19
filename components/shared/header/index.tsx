import { APP_NAME } from "@/lib/constant/index";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/shared/header/menu";
const Header = () => {
  return (
    <header style={{ width: "100%", borderBottom: "1px solid #ddd" }}>
      {/* Header container with responsive layout */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
        }}
      >
        {/* Logo and App Name */}
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <Image
            src="/images/logo.svg"
            alt={`${APP_NAME} logo`}
            height={35}
            width={35}
            priority
          />
          <span
            style={{
              display: "none",
              fontWeight: "bold",
              fontSize: "1.25rem",
              marginLeft: "12px",
            }}
            className="lg:block"
          >
            {APP_NAME}
          </span>
        </Link>

        {/* Menu component (Cart and Sign In) */}
        <Menu />
      </div>
    </header>
  );
};

export default Header;
