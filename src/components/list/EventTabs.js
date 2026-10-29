import * as React from "react"
import PropTypes from "prop-types"
import ShootList from "./ShootList"
import DestList from "./DestList"

const EventListing = ({
  mode = "events",
  shoots = [],
  allShoots = shoots,
  userLocation,
  onVisibleShootsChange,
  onSelectShoot,
}) => {
  const listing = mode === "destination" ? (
    <DestList
      shoots={shoots}
      allShoots={allShoots}
      onVisibleShootsChange={onVisibleShootsChange}
      onSelectShoot={onSelectShoot}
      userLocation={userLocation}
    />
  ) : (
    <ShootList
      shoots={shoots}
      allShoots={allShoots}
      onVisibleShootsChange={onVisibleShootsChange}
      onSelectShoot={onSelectShoot}
      userLocation={userLocation}
    />
  )

  return (
    <section className="directory-section container-fluid">
      <div className="container-fluid mt-3 gx-0 p-0 px-0">
        <div className="list-scroll-container">{listing}</div>
      </div>
    </section>
  )
}

EventListing.propTypes = {
  mode: PropTypes.string,
  shoots: PropTypes.array,
  allShoots: PropTypes.array,
  userLocation: PropTypes.object,
  onVisibleShootsChange: PropTypes.func,
  onSelectShoot: PropTypes.func,
}

export default React.memo(EventListing)
