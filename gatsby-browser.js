// gatsby-browser.js
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./src/styles/global.css"

export const onClientEntry = () => {
  // jQuery (required by older Snipcart v2)
  const jq = document.createElement("script")
  jq.src = "https://code.jquery.com/jquery-3.4.1.min.js"
  jq.integrity = "sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
  jq.crossOrigin = "anonymous"
  document.head.appendChild(jq)

  // Snipcart
  //   jq.onload = () => {
  //     const snip = document.createElement("script")
  //     snip.src = "https://cdn.snipcart.com/scripts/2.0/snipcart.js"
  //     snip.setAttribute(
  //       "data-api-key",
  //       "ZDY2ZThjZmMtYTQzYS00YTVjLWFhMTQtYTMyOTE3NWEyNmJkNjM2ODAyNjEzODcxNDY5NTQ3"
  //     )
  //     snip.id = "snipcart"
  //     document.head.appendChild(snip)

  //     // Snipcart CSS
  //     const snipCss = document.createElement("link")
  //     snipCss.href = "https://cdn.snipcart.com/themes/2.0/base/snipcart.min.css"
  //     snipCss.rel = "stylesheet"
  //     snipCss.type = "text/css"
  //     document.head.appendChild(snipCss)
  //   }
  // }

  // === Snipcart post-purchase handler ===
  // if (typeof window !== "undefined") {
  //   document.addEventListener("snipcart.ready", () => {
  //     window.Snipcart.subscribe("order.completed", order => {
  //       const purchasedItem = order.items?.[0]
  //       if (!purchasedItem) return

  //       const planId = purchasedItem.id

  //       const savedHost = localStorage.getItem("mock_venue_host")
  //       if (!savedHost) return

  //       const host = JSON.parse(savedHost)

  //       const updatedHost = {
  //         ...host,
  //         planId,
  //         isClaimed: true,
  //         claimedAt: new Date().toISOString(),
  //       }

  //       localStorage.setItem("mock_venue_host", JSON.stringify(updatedHost))

  //       console.log("✅ Venue claimed with plan:", planId)
  //       window.Snipcart.api.modal.close()
  //     })
  //   })
  // }

  // === Floating close button for Snipcart modal ===
  // if (typeof window !== "undefined") {
  //   let closeBtn = null

  //   const createCloseButton = () => {
  //     if (closeBtn) return closeBtn

  //     closeBtn = document.createElement("button")
  //     closeBtn.innerHTML = "✕"
  //     closeBtn.setAttribute("aria-label", "Close cart")
  //     closeBtn.style.cssText = `
  //       position: fixed; top: 12px; right: 16px; z-index: 999999;
  //       background: white; border: 1px solid #ccc; border-radius: 50%;
  //       width: 36px; height: 36px; font-size: 20px; line-height: 1;
  //       cursor: pointer; display: none; align-items: center; justify-content: center;
  //       box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  //     `
  //     closeBtn.onclick = () => {
  //       if (window.Snipcart?.api?.modal) {
  //         window.Snipcart.api.modal.close()
  //       }
  //     }
  //     document.body.appendChild(closeBtn)
  //     return closeBtn
  //   }

  //   document.addEventListener("snipcart.ready", () => {
  //     console.log("Snipcart ready – setting up close button")
  //     const btn = createCloseButton()

  //     window.Snipcart.subscribe("modal.opened", () => {
  //       console.log("Snipcart modal opened")
  //       btn.style.display = "flex"
  //     })

  //     window.Snipcart.subscribe("modal.closed", () => {
  //       btn.style.display = "none"
  //     })
  //   })
}
