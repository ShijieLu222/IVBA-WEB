export interface Venue {
    id: string;
    venue_name: string;
    description: string;
    address: string;
    size_sqm: number;
    price: number;
    currency: string;
    maximum_capacity: number;
    facilities: Facility[];
    availability: VenueAvailability[];
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    user_has_saved: boolean;
    status: VenueStatus;
    created_at: string;
    updated_at: string;
}

export interface VenueAvailability {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
}

export interface VenueBooking {
    id: string;
    venue: Venue;
    date_times: VenueAvailability[];
    total_cost: number;
    status: BookingStatus;
    created_at: string;
    updated_at: string;
}

export interface Facility {
    display_name: string;
    facility_information: string[];
}

export enum VenueStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    PENDING = 'PENDING'
}

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

export interface VenueAvailability {
    start_date: string;
    end_date: string;
    start_time: string;
    end_time: string;
}