"use client";

const CartTableSkeleton = () => {
  return (
    <tbody>
      {[...Array(3)].map((_, rowIndex) => (
        <tr key={rowIndex}>
          <td>
            <div className="skeleton-box image-skeleton"></div>
          </td>
          <td>
            <div className="skeleton-box text-skeleton"></div>
          </td>
          <td>
            <div className="skeleton-box text-skeleton"></div>
          </td>
          <td>
            <div className="skeleton-box text-skeleton"></div>
          </td>
          <td>
            <div className="skeleton-box button-skeleton"></div>
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default CartTableSkeleton;
