import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";    // for showing notification badges


const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Helmet>
        {/* These are the things required for SEO. React doesn't support it so we've to use react-helmet in order to provide the data required for SEO */}
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />
        {children}
      </main>
      <Footer />
    </div>
  );
};

// These are the default parameters that the 'Layout' component uses if nothing is passed 
Layout.defaultProps = {
  title: "E-Store - Shop Now!",
  description: "mern stack project",
  keywords: "mern,react,node,mongodb",
  author: "XyloTo",
};

export default Layout;