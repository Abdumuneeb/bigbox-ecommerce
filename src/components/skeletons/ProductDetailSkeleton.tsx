"use client";

import { Grid, Skeleton } from "@mui/material";

export default function ProductDetailSkeleton() {
  return (
    <div className="productDetail">
      <Grid container spacing={5}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 7 }} className="leftCol">
          <div className="header">
            <Skeleton variant="text" width={250} height={40} />
            <Skeleton variant="text" width={80} height={30} />
          </div>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={100}
            className="description"
          />
          <Skeleton variant="rounded" width={140} height={40} />
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton variant="rectangular" width="100%" height={350} />
        </Grid>
      </Grid>
    </div>
  );
}
