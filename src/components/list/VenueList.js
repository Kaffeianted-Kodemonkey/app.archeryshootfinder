// src/components/list/VenueList.js
// Poupers of this page: This is my venue directory tab disply.
import * as React from "react";
import { useStaticQuery, graphql, Link } from "gatsby";
import { getDistance } from "../../utils/distance";

// venueType mapping for icons and styles (uppercase enums)
const venueTypeMapping = {
  CLUB: { icon: "bi-building", className: "bg-primary text-white", rowBg: "bg-light" },
  RANGE: { icon: "bi-crosshairs", className: "bg-success text-white", rowBg: "bg-light" },
  PRO_SHOP: { icon: "bi-shop", className: "bg-danger text-white", rowBg: "bg-light" },
  ASSOCIATION: { icon: "bi-people", className: "bg-purple text-white", rowBg: "bg-light" },
  ORGANIZATION: { icon: "bi-star", className: "bg-warning text-dark", rowBg: "bg-light" },
  default: { icon: "bi-geo-alt", className: "bg-secondary text-white", rowBg: "bg-light" }
};

const VenueList = ({ location, showUnclaimed = false }) => {
  const data = useStaticQuery(graphql`
    query VenueListQuery {
      allVenuesJson {
        nodes {
          id
          venueId
          slug
          name
          description
          venueType
          subscription  # Changed from tier
          location {
            city
            state
            lat
            lng
          }
          contact {
            phone
            email
          }
          hours{
            day
            open
            close
            closed
          }
          facilities
          hostedShoots {
            venueId
            date
          }
          isClaimed
        }
      }

      allShootsJson {
        nodes {
          id
          shootId
          name
          date
          isVerified
          venueId
          venue {
            venueId
            isClaimed
            subscription
          }             
        }
      }
    }
  `);

  let venues = data.allVenuesJson.nodes;
  const allShoots = data.allShootsJson.nodes;

  // Filter unclaimed (basic tier)
  if (!showUnclaimed) {
    venues = venues.filter(venue => venue.subscription !== "basic");
  }

  // Sort by distance if location, else name
  if (location && location.lat && location.lng) {
    venues.sort((a, b) => {
      const distA = getDistance(location, a.location);
      const distB = getDistance(location, b.location);
      return distA - distB;
    });
  } else {
    venues.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Manual join: Get upcoming count from hostedShoots IDs + allShoots
  const getUpcomingCount = (hostedShoots) => {
    const now = new Date();
    // hostedShoots is now an array of objects, not IDs
    return (hostedShoots || []).filter(shoot => new Date(shoot.date) > now).length;
  };


  if (venues.length === 0) {
    return (
      <div className="alert alert-info text-center py-4 my-3 mx-0 px-0" role="alert" aria-live="polite">
        No venues found. {showUnclaimed ? "" : "Toggle to show unclaimed venues."}
      </div>
    );
  }

  return (
    <div className="row">
      {venues.map((venue) => {
        const location = venue.location || {};
        const contact = venue.contact || {};
        const equipment = venue.equipment || {};
        const hours = venue.hours || {};
        const membership = venue.membership || {};
        const distanceValue = (location && venue.location) ? getDistance(location, venue.location).toFixed(1) : "N/A";
        const distance = `${distanceValue} mi`;
        /* console.log('location:', location);  // Check if location is set
        console.log('venue.location:', location);    // Check venue coords
        console.log('distance calculated:', distance);  // Verify final value
 */
        const cityState = `${location.city || ''}, ${location.state || ''}`;
        const mapping = venueTypeMapping[venue.venueType] || venueTypeMapping.default;
        const shootsCount = getUpcomingCount(venue.hostedShoots || []);
        // Logic helpers
        const isUnclaimed = venue.subscription === "BASIC";
        const isNonProfit = venue.subscription === "FREEMIUM";
        const isPaidTier = venue.subscription === "PREMIUM" || venue.subscription === "DESTINATION";


        const hasPhone = contact.phone && contact.phone.trim().length > 0;
        const hasEmail = contact.email && contact.email.trim().length > 0;

        return (
          <div key={venue.id} className="col-12 mb-3">
            <div className={`card ${mapping.rowBg}`}>
              <div className="card-header pt-3">
                <div className="row align-items-center">
                  <div className="col-4">
                    <span className={`badge ${mapping.className}`}>
                      <i className={`bi ${venue.icon || mapping.icon} me-1`}></i>{venue.venueType}
                    </span>
                    <p className="fs-6 mt-3"><i className="bi bi-geo-alt"></i> {distance}<br />{cityState}</p>
                  </div>
                  <div className="col m-0 p-0">
                    <h2 className="card-title fs-5 mb-0">{venue.name}</h2>
                    <p className="card-text text-muted small mb-0">{venue.description}</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    {venue.facilities && venue.facilities.length > 0 && (
                      <p className="card-text mb-1"><strong>Facilities:</strong><br /> {venue.facilities.join(', ')}</p>
                    )}
                    {equipment.rentalAvailable !== undefined && (
                      <p className="card-text mb-1">
                        <strong>Equipment:<br /></strong> {equipment.rentalAvailable ? 'Rentals available' : 'BYO'} {equipment.notes ? ` - ${equipment.notes}` : ''}
                      </p>
                    )}
                    {hours.weekday && (
                      <p className="card-text mb-1"><strong>Hours:<br /></strong> Weekdays: {hours.weekday} <br /> Weekends: {hours.weekend || 'N/A'}</p>
                    )}
                  </div>
                  <div className="col-md-6">
                    {hasPhone && <p className="card-text mb-1"><strong><i className="bi bi-telephone-outbound" data-label="Phone"></i></strong> <a href={`tel:${contact.phone}`}>{contact.phone}</a></p>}
                    {hasEmail && <p className="card-text mb-1"><strong><i className="bi bi-envelope-arrow-up" data-label="Email"></i></strong> <a href={`mailto:${contact.email}`}>{contact.email}</a></p>}
                    {membership.required !== undefined && (
                      <p className="card-text mb-1">
                        <strong>Membership:</strong> {membership.required ? 'Required' : 'Optional'} - {membership.details || 'N/A'}
                        {membership.url && <a href={membership.url} className="ms-1">Join</a>}
                      </p>
                    )}
                    {shootsCount > 0 && (
                      <Link to={`?activeTab=shoots&clubId=${venue.id}`} className="text-decoration-none fw-medium">
                        {shootsCount} Upcoming Shoots <i className="bi bi-arrow-right ms-1 text-primary"></i>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
              {/* Card Footer UI */}
              <div className="card-footer d-flex justify-content-between align-items-center">
                {venue.isClaimed ? (
                  <>
                    <span className="text-success small">
                      <i className="bi bi-patch-check-fill"></i> {isNonProfit ? "Verified Club" : "Verified Venue"}
                    </span>
                    <Link to={`/venues/${venue.slug}`} className="btn btn-sm btn-success">View Details</Link>
                  </>
                ) : (
                  <>
                    <span className="text-muted small"><i className="bi bi-question-circle"></i> Unclaimed</span>
                    <Link to="/pricing" className="btn btn-sm btn-outline-warning">Claim Listing</Link>
                  </>
                  
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VenueList;