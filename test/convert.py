import pandas as pd

df = pd.read_csv("./usersData.csv")


df['dateofJoining'] = pd.to_datetime(df['dateofJoining'], format='%d/%m/%Y').dt.strftime('%Y-%m-%d')
df['createdAt'] = pd.to_datetime('now')

df.to_csv("./updated_file.csv", index=False)

print("Date format converted successfully.")