# Data Source Mapping

## AIS

### Raw Columns

┌─────────┬────────────────────┐
│ (index) │ Values             │
├─────────┼────────────────────┤
│ 0       │ 'MMSI'             │
│ 1       │ 'BaseDateTime'     │
│ 2       │ 'LAT'              │
│ 3       │ 'LON'              │
│ 4       │ 'SOG'              │
│ 5       │ 'COG'              │
│ 6       │ 'Heading'          │
│ 7       │ 'VesselName'       │
│ 8       │ 'IMO'              │
│ 9       │ 'CallSign'         │
│ 10      │ 'VesselType'       │
│ 11      │ 'Status'           │
│ 12      │ 'Length'           │
│ 13      │ 'Width'            │
│ 14      │ 'Draft'            │
│ 15      │ 'Cargo'            │
│ 16      │ 'TransceiverClass' │
└─────────┴────────────────────┘

## Port Performance

Headers:
┌─────────┬───────────────────────────────────────────────────────────────────────────┐
│ (index) │ Values                                                                    │
├─────────┼───────────────────────────────────────────────────────────────────────────┤
│ 0       │ ''                                                                        │
│ 1       │ 'Economy_Label'                                                           │
│ 2       │ 'CommercialMarket_Label'                                                  │
│ 3       │ 'Average_age_of_vessels_years_Value'                                      │
│ 4       │ 'Average_age_of_vessels_years_MissingValue'                               │
│ 5       │ 'Median_time_in_port_days_Value'                                          │
│ 6       │ 'Median_time_in_port_days_MissingValue'                                   │
│ 7       │ 'Average_size_GT_of_vessels_Value'                                        │
│ 8       │ 'Average_size_GT_of_vessels_MissingValue'                                 │
│ 9       │ 'Average_cargo_carrying_capacity_dwt_per_vessel_Value'                    │
│ 10      │ 'Average_cargo_carrying_capacity_dwt_per_vessel_MissingValue'             │
│ 11      │ 'Average_container_carrying_capacity_TEU_per_container_ship_Value'        │
│ 12      │ 'Average_container_carrying_capacity_TEU_per_container_ship_MissingValue' │
│ 13      │ 'Maximum_size_GT_of_vessels_Value'                                        │
│ 14      │ 'Maximum_size_GT_of_vessels_MissingValue'                                 │
│ 15      │ 'Maximum_cargo_carrying_capacity_dwt_of_vessels_Value'                    │
│ 16      │ 'Maximum_cargo_carrying_capacity_dwt_of_vessels_MissingValue'             │
│ 17      │ 'Maximum_container_carrying_capacity_TEU_of_container_ships_Value'        │
│ 18      │ 'Maximum_container_carrying_capacity_TEU_of_container_ships_MissingValue' │
│ 19      │ 'period'                                                                  │
└─────────┴───────────────────────────────────────────────────────────────────────────┘

# Fuel Efficiency

Headers:
┌─────────┬──────────────────────┐
│ (index) │ Values               │
├─────────┼──────────────────────┤
│ 0       │ 'ship_id'            │
│ 1       │ 'ship_type'          │
│ 2       │ 'route_id'           │
│ 3       │ 'month'              │
│ 4       │ 'distance'           │
│ 5       │ 'fuel_type'          │
│ 6       │ 'fuel_consumption'   │
│ 7       │ 'CO2_emissions'      │
│ 8       │ 'weather_conditions' │
│ 9       │ 'engine_efficiency'  │
└─────────┴──────────────────────┘