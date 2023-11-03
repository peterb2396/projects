def plan_road_trip(p, D, m):
    location = 0
    i = 0
    ops = 0
    stations = []

    while location + p < m:
        # Find the farthest reachable gas station
        while i + 1 < len(D) and D[i + 1] - location <= p:
            i += 1
            ops+=1
        # Append the selected gas station to the stations array
        stations.append(D[i])

        # Update the current location
        location = D[i]

    print("ops: ", ops)

    return stations

# Example data
D = [0, 50, 80, 120, 200, 290, 350, 400]
m = 440  # Total trip miles
p = 100  # Tank capacity

stations_to_stop = plan_road_trip(p, D, m)
print("Gas stations to stop at:", stations_to_stop)



D = [0, 50, 60, 70, 80, 90, 100, 110, 120, 200, 300, 400]
m = 500  # Total trip miles
p = 100  # Tank capacity

stations_to_stop = plan_road_trip(p, D, m)
print("WORST CASE stations to stop at:", stations_to_stop)