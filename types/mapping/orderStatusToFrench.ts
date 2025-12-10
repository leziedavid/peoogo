import { OrderStatusFrench } from "../AllTypes";

export const orderStatusToFrench: Record<string, string> = {
    PENDING: OrderStatusFrench.PENDING,
    VALIDATED: OrderStatusFrench.VALIDATED,
    IN_PROGRESS: OrderStatusFrench.IN_PROGRESS,
    COMPLETED: OrderStatusFrench.COMPLETED,
    CANCELLED: OrderStatusFrench.CANCELLED,
};
