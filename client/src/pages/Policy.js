import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="row contactus ">
        <div className="col-md-6 ">
          <img
            src="/images/privacypolicy.jpeg"
            alt="privacypolicy"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          {/* <p>#1 privacy policy</p>
          <p>#2 privacy policy</p>
          <p>#3 privacy policy</p>
          <p>#4 privacy policy</p>
          <p>#5 privacy policy</p>
          <p>#6 privacy policy</p>
          <p>#7 privacy policy</p> */}
          <p className="text-justify mt-2">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus
            officiis obcaecati esse tempore unde ratione, eveniet mollitia,
            perferendis eius temporibus dicta blanditiis doloremque explicabo
            quasi sunt vero optio cum aperiam vel consectetur! Laborum enim
            accusantium atque, excepturi sapiente amet! Tenetur ducimus aut
            commodi illum quidem neque tempora nam.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;