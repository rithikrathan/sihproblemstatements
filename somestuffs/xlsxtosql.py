import pandas as pd
import sqlite3

df = pd.read_excel("../SIH_PS.xlsx")
conn = sqlite3.connect("../backend/testdb.sqlite")
df.to_sql("table2k24", conn, if_exists="replace", index=False)
conn.close()
