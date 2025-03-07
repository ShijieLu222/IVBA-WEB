import enum

class BookingStatus(str,enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"