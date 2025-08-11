import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const ProductCardSkeleton = () => (
  <div className="col-lg-4">
    <Box
      className="case-item position-relative overflow-hidden rounded mb-2"
      sx={{ width: "100%" }}
    >
      <Skeleton variant="rectangular" width="100%" height={300} />
    </Box>
  </div>
);

export default ProductCardSkeleton;
