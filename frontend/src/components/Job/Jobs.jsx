import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import Navbar from "../Layout/Navbar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:4000/api/v1/job/getall", {
          withCredentials: true,
        });
        setJobs(res.data);
        setFilteredJobs(res.data.jobs || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    let filtered = jobs.jobs || [];

    if (searchTerm) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    if (selectedCountry) {
      filtered = filtered.filter(job => job.country === selectedCountry);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, selectedCategory, selectedCountry, jobs]);

  // Get unique categories and countries for filters
  const categories = [...new Set((jobs.jobs || []).map(job => job.category))];
  const countries = [...new Set((jobs.jobs || []).map(job => job.country))];
  if (!isAuthorized) {
    navigateTo("/");
  }

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedCountry("");
  };

  return (
    <div>
      <Navbar />
      <section className="jobs page">
        <div className="container">
          <div className="jobs-header">
            <h1>Find Your Dream Job</h1>
            <p className="jobs-subtitle">Discover amazing opportunities from top companies</p>
          </div>

          {/* Search and Filter Section */}
          <div className="search-filter-section">
            <div className="search-container">
              <div className="search-box">
                <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="        Search jobs by title, category, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="filters-container">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="filter-select"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>

              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>

          {/* Jobs Results */}
          <div className="jobs-results">
            <div className="results-header">
              <p className="results-count">
                {loading ? "Loading..." : `${filteredJobs.length} jobs found`}
              </p>
            </div>

            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading amazing opportunities...</p>
              </div>
            ) : (
              <div className="banner">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((element) => (
                    <div className="job-card" key={element._id}>
                      <div className="job-card-header">
                        <div className="job-category-badge">{element.category}</div>
                        <h3 className="job-title">{element.title}</h3>
                      </div>
                      
                      <div className="job-details">
                        <div className="job-detail-item">
                          <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span>{element.country}</span>
                        </div>
                        
                        {element.company && (
                          <div className="job-detail-item">
                            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span>{element.company}</span>
                          </div>
                        )}
                        
                        {element.salary && (
                          <div className="job-detail-item">
                            <svg className="detail-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>{element.salary}</span>
                          </div>
                        )}
                      </div>

                      <div className="job-card-footer">
                        <Link to={`/job/${element._id}`} className="view-details-btn">
                          View Details
                          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-jobs-found">
                    <svg className="no-jobs-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.137 0-4.146-.832-5.657-2.343" />
                    </svg>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria or clear the filters to see more opportunities.</p>
                    <button onClick={clearFilters} className="clear-filters-btn">
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Jobs;
