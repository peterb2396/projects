n = 40
C = []

# Optimal because number of coins can not be decreased, hence no two coins can be replaced by one coin by design.

for c in [25, 10, 5, 1]:
    while c <= n:
        n-=c
        C.append(c)

print(C)