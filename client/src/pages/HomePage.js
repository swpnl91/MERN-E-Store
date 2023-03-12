import React from "react";


import Layout from "./../components/Layout/Layout";

const HomePage = () => {
  
  return (
    <Layout title={"Our Products - Best offers!"}>
      
      {/* banner image */}
      <img
        src="/images/banner.png"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}

      <div className="container-fluid row mt-3 home-page">
        
        <div className="col-md-3 filters">
          
          <h4 className="text-center">Filter By Category</h4>
          
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          
          

        </div>

        

      </div>

    </Layout>
  );
};

export default HomePage;