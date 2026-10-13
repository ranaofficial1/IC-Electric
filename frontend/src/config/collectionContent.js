// Marketing copy + imagery for the home-page "collection" tiles, keyed by the
// category/subcategory slug the tile links to. This is presentation only — the
// tiles themselves (which ones exist, their names, where they link, product
// counts and "from" prices) come from the API. A subcategory with no entry here
// (for example one added later in the admin panel) still renders, falling back
// to its own name/description and a gradient tile.
export const COLLECTION_CONTENT = {
  "table-fans": {
    series: "Portable Series",
    badge: "High RPM",
    blurb: "Experience refreshing breeze with compact high-thrust oscillating table fans.",
    icon: "desk",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1VfpPK_ii84odc-32fNe5CHtwj_KqB_aELK0ZMRXfVX1HkRTSh2b4zdFI5sp6uTWux0cTS86u9M9yKd_2A8hy4kXGNE2v2LtJfWeOITuVCXAOSMu7qOyhXEwEtssbRvZUeDAB4uqx15aftdSsVU-uCnmHzHllzj92dp5xhaI2appc6OiHYC_593x8bKCZVPTd-gmUy9xhqOP-vrwp3zjVxY1iVU2CyEuS1J8qAAPUlTj_4IrMshv8hbjw",
  },
  "ceiling-fans": {
    series: "Designer Series",
    badge: "Energy Saving",
    blurb: "Serene quietness, aerodynamically designed sweeps and high air delivery for every room.",
    icon: "mode_fan",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1VAs2CM4j6llpn8nDD-U2o_MVCGyxaCc2prJhSQGUCWZEIcnxHzCcFBsGhmQYv0Kao7t1U3NA8XxZJy5brL5J2CvB_DVhcIGRWprEvCj3opDJyacwnUo2RJnzon-QZs-oTk6MglejSS2cG-hXJmatwW_P01jxkTUZ9A5zWjw4Xx87ekmDrlR38qsMOZmQqBm5ipa_YKr9laH0Sxo5aEQpc8cnMZHy5y0PxAWPivgJ4W6KpyYvAUxUMw6Sw",
  },
  "storage-heaters": {
    badge: "5-Star BEE Rated",
    blurb: "High-capacity tanks equipped with custom temperature presets, magnesium anode rod for anti-corrosion, and 8-bar pressure compatibility.",
    highlight: "7-Year Tank Manufacturer Warranty",
    highlightIcon: "verified",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1X5y84lO7jt3z10jnenlVrKqlDoaNOVrtIpy8M4P8gxkLcrb4b6hQxEDYAOWApgtMX88eJK8Iu89KZ9yPfBlZ9L7-IjXgogSsybsm6xLEoL3dVyBynH2aArujmFunoxarD6gAM8ZymMXsiNH2FM7y7WOihvKmR-56XNb2mklFfkr1VGJToBF8bAAsYbikfbxdAQqTRp9yt9X5htDsDOSsej3yLEdMESukE_yIrqOIt_MuBveiXPoCKWKOI",
  },
  "instant-heaters": {
    badge: "Instant Hot Water",
    blurb: "Fast copper heating element delivering steaming water in seconds. Compact aerodynamic body tailored for contemporary bathroom aesthetics.",
    highlight: "Rapid Pure Copper Coil",
    highlightIcon: "bolt",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1UlsrdZV1nSG9f85QJjVhEnc2bT-0aQjn-uT6hKRTWGDI9n9-kNVOl5rGQKdKfCVo1FBsTIFa4hOfnu_3TQl0MxHE8Zlu5ramK6MV8CFldH30MrtqoUdyKIdEA-pSMgcucB9W4WPBhc4OPSAxYj_ZnF8nCtCDHUXh2EX4x8X0dUYhjE_JOlysWWWrFizuoMI-Ugm5bzDx3RDXdB8E5hmiVTu6mIfrbHdn4aBZBvlCf2_i_MtZrOsWiglA",
  },
  "immersion-rod": {
    badge: "Heavy Duty",
    blurb: "Experience efficient heating with anti-corrosive nickel-plated heating coils, water level indicator, and shock-proof safety handle.",
    highlight: "Water-proof Shock Resistant Head",
    highlightIcon: "shield",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1Uc-2xCJq5VPQcYUG0Ze9tEbOyYvE3pTxdSVwKUO7aGCKPkQG22yrm6P4jw9EP7z8Ge9bMfOGwNuX5hINVfMWJDkROeU5pk-kHGTy851sjZa7JPa40MjbsZP-P750hfuqc6K0wpfHF07PjwuSrBsLRUfbSOIKSDlNY6NsjDqTEsAbtQ3St5fj5aJ_ctLnarhOkT1RL01IYdLKKQclv8TTZ-xhy5VQE3hWnmEfvJvJtHsl2_iFbBUioC0A",
  },
  "ceiling-lights": {
    image: "https://lh3.googleusercontent.com/aida/AEtjO1WDtGKHZcjZXXBzM7dHHQkkSsdyz8lbJmMM3U1wuxpOzqBti2BGOy2awkYGTRc9kF5J7EUGbxvo9wlUULZ51GZXzwBYaqjexytYl2kiKADzEzkWJRY90e2LJj7GsDuBQvDkUtTT8KMJ8piLNWoB1VVUiUuXW3eWkOBnrORjcK9ShIMmB9CtyumdQflBlXJUGGZ15YoTL76QagX-L7-Lv1p9EtYnTP4WCn42FvE-pMVHWcAZ3SLf1EBHCbs",
  },
  "tube-lights": {
    image: "https://lh3.googleusercontent.com/aida/AEtjO1Ug8TZ_H-zTVtsa1U6pBKpXMh6Id_kpJOi36PxIKWcfuk3dstmxLpVIjm-8HGHXQcmp8M7atGx2ZGV-UpMDMOUUyJ7gXazppCio6kLwtIEkHG7JhzlXNbsuBZg_hdWOnwfun5lVGO2xBsDZUaKgm36px1CTnPipi8_JRJYE4UDSZux_52rh4mBvUoOYX8Knte5zs6Lto8EzZCwhsvV9WJx3mfgvVnZ8k6jNrJMMZk24f2p0Mj0_IR5MoxQ",
  },
  "extension-board": {
    image: "https://lh3.googleusercontent.com/aida/AEtjO1VWkI0DPEFKTNhLuyqLbCK7rOIPddrp-R5nKp9BDv8EfChkQfGMEVgmWAlXRzgVnld4y0V7qvh14PD2zDRNr_zXThGnyunPNGNOrNlYuMxSRq6RGwuUFD0a-Abmxx_k97cc482rHTL5A661CWiTdTNzDBj8Kq7udWSxktN2cG9E-3vqoxnVpfP5wULYp3E4KSBkoAnp18fD3CNeSEIoFTsKSrazS56G8BI0TCt-g4EpISxLAU0ScgaYeWM",
  },
};

export function collectionContent(slug) {
  return COLLECTION_CONTENT[slug] || {};
}
