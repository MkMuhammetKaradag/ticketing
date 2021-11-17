import Link from "next/link";

const HeaderComponent = ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign up ", href: "/auth/signup" },
    !currentUser && { label: "Sign in", href: "/auth/signin" },
    currentUser && { label: "Sell Ticket", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign out", href: "/auth/signout" },
  ]
    .filter((linkCofig) => linkCofig)
    .map(({ label, href }) => {
      return (
        <li className="nav-item" key={href}>
          <Link href={href}>
            <a className="nav-link">{label}</a>
          </Link>
        </li>
      );
    });
  return (
    <nav className="navbar navbar-ligth bg-ligth">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav s-flex  aligin-items-center">{links}</ul>
      </div>
    </nav>
  );
};
export default HeaderComponent;
