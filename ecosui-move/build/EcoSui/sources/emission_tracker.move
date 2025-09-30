module ecosui::emission_tracker {
    use sui::event;
    use sui::clock;

    /// Event recorded when emission data is verified/tracked.
    public struct EmissionVerifiedEvent has copy, drop {
        sensor_id: std::string::String,
        co2_level: u64,
        particulate_matter: u64,
        temperature: u64,
        humidity: u64,
        timestamp: u64
    }

    /// Minimal API to align with the frontend's expected module name.
    /// This function records an event with basic environmental readings.
    public fun verify_emission_data(
        sensor_id: std::string::String,
        co2_level: u64,
        particulate_matter: u64,
        temperature: u64,
        humidity: u64,
        clk: &clock::Clock
    ) {
        event::emit(EmissionVerifiedEvent {
            sensor_id,
            co2_level,
            particulate_matter,
            temperature,
            humidity,
            timestamp: clock::timestamp_ms(clk),
        });
    }
}
