import { INestApplication } from "@nestjs/common";
import { Info } from "./../src/info/info.entity";
import { DataSource } from "typeorm";

export async function clearDB(app:INestApplication){
	// Clear db after testing
	const dataSource = app.get(DataSource);
	await dataSource.createQueryBuilder().delete().from(Info).execute();
}
