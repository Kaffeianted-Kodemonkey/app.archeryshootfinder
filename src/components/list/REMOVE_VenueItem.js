// src/components/list/VenueItem.js
import * as React from "react";
import { Link } from "gatsby";
import { getDistance } from "../../utils/distance";
import { getVenueShootCounts, ContactIcons, ActionButtons } from "../../utils/listUtils"; // CLEANUP: Use shared utils; remove shootsData import

const VenueItem = ({ venue, location, venueMapping, showUnclaimed, isDesktop, stripeIndex }) => {
  const { id, slug, type, tier, name, location: venueLoc, contact, iconColor } = venue;
  const mapping = venueMapping[type] || { icon: "bi-geo-alt", color: "#6c757d", rowBg: "bg-light", textColor: "text-secondary", className: "bg-secondary text-white" };
  const isBasic = tier === "basic" || !showUnclaimed;
  const rowClass = `venue-row--${type} venue-row--${tier}`;
  // Striped: Venue tint for claimed; alternate light/white for unclaimed
  const rowBgColor = !isBasic && iconColor ? iconColor + '20' : (stripeIndex % 2 === 0 ? '#f8f9fa' : '#ffffff');
  const mutedStyle = isBasic ? { opacity: 0.5 } : {};

  // CLEANUP: Use pre-computed counts from utils (or pass from SearchContext)
  const { current: currentCount, upcoming: upcomingCount } = getVenueShootCounts(id);

  // Distance (unchanged)
  const distance = location.lat && location.lng && venueLoc.lat && venueLoc.lng 
    ? `${getDistance(location, venueLoc).toFixed(1)} mi` 
    : null;

  const typeIcon = <i className={`bi ${mapping.icon} me-1`} aria-hidden="true"></i>;

  // CLEANUP: Use shared ContactIcons
  const contactIcons = <ContactIcons contact={contact} />;

  if (isDesktop) {
    return (
      <tr className={rowClass} style={{ ...mutedStyle, backgroundColor: rowBgColor }} role={isBasic ? "row" : undefined} aria-label={isBasic ? "Unclaimed venue" : undefined}>
        {/* Type column */}
        <td className="align-middle px-3">
          <span className="d-flex align-items-center" aria-label={`Venue type: ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
            {typeIcon} <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </span>
        </td>
        {/* Name column */}
        <td className="align-middle px-2">
          {isBasic ? <span>{name}</span> : <Link to={`/venues/${slug}`}>{name}</Link>}
        </td>
        {/* Location column - align-top for multi-line */}
        <td className="align-middle px-2">
          <div className="text-muted">
            {venueLoc.city}, {venueLoc.state}
            {distance && (
              <>
                <br />
                <small>{distance}</small>
              </>
            )}
          </div>
        </td>
        {/* Shoots column - stacked for alignment */}
        <td className="align-middle px-2">
          <Link to={`/shoots?venue=${id}&tab=current`} className="text-primary text-decoration-none fw-bold d-block mb-1">{currentCount} Current</Link>
          <Link to={`/shoots?venue=${id}&tab=upcoming`} className="text-secondary text-decoration-none fw-bold">{upcomingCount} Upcoming</Link>
        </td>
        {/* More Info column: Contacts + Actions */}
        <td className="align-middle px-2 small">
          <div className="mb-2">
            {isBasic ? (
              <span className="text-muted d-block mb-1">Claim for contact</span>
            ) : (
              contactIcons
            )}
          </div>
          <ActionButtons 
            isBasic={isBasic} 
            slug={slug} 
            venueId={id} 
            location={venueLoc} // Pass for maps
            isDesktop={true} 
          /> {/* CLEANUP: Use shared actions */}
        </td>
      </tr>
    );
  }

  // Mobile (updated for explicit stacking: name > location > shoots > contacts > actions)
  const mobileBgColor = !isBasic && iconColor ? iconColor + '20' : (stripeIndex % 2 === 0 ? '#f8f9fa' : '#ffffff');
  return (
    <div className={`card mb-3 border-0 shadow-sm ${rowClass}`} style={mutedStyle}>
      <div className="card-header d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: mobileBgColor }} aria-label={`Venue type: ${type}`}>
        <span className={`badge ${mapping.className || 'bg-secondary text-white'}`} aria-label={`Venue type: ${type.charAt(0).toUpperCase() + type.slice(1)}`}>
          {typeIcon} {type.charAt(0).toUpperCase() + type.slice(1)}
        </span>
        {distance && <span className="badge bg-secondary fs-6">{distance}</span>}
      </div>
      <div className="card-body p-3">
        {/* Name - Prominent with margin below */}
        <h6 className="mb-2 fw-bold">
          {isBasic ? <span>{name}</span> : <Link to={`/venues/${slug}`}>{name}</Link>}
        </h6>
        
        {/* Location group - Stacked under name */}
        <div className="mb-2 text-muted">
          <div>{venueLoc.city}, {venueLoc.state}</div>
          {distance && (
            <small className="d-block">{distance}</small> // Ensure distance stacks below city/state
          )}
        </div>
        
        {/* Shoot counts group - Below location, inline links with margin */}
        <div className="mb-3">
          <Link to={`/shoots?venue=${id}&tab=current`} className="text-primary text-decoration-none fw-bold me-1">{currentCount} Current</Link>
          / <Link to={`/shoots?venue=${id}&tab=upcoming`} className="text-secondary text-decoration-none fw-bold">{upcomingCount} Upcoming</Link>
        </div>
        
        {/* Contact icons - Below shoots */}
        <div className="mb-2">
          {contactIcons}
        </div>
        
        {/* Actions - At bottom */}
        <div className="d-flex gap-2">
          <ActionButtons 
            isBasic={isBasic} 
            slug={slug} 
            venueId={id} 
            location={venueLoc}
            isDesktop={false} // For mobile button sizing
          /> {/* CLEANUP: Use shared actions */}
        </div>
      </div>
    </div>
  );
};

export default VenueItem;
