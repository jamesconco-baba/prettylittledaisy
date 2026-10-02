export const FREE_OVER_PENCE = 6000;
export const SHIPPING_PENCE = 395;
export const shippingFor = (subtotalPence: number) => (subtotalPence >= FREE_OVER_PENCE ? 0 : SHIPPING_PENCE);
