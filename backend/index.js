import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import categoryRoute from "./routes/category.route.js";
import skillRoute from "./routes/skill.route.js";
import levelRoute from "./routes/level.route.js";
import positionRoute from "./routes/position.route.js";
import salaryRoute from "./routes/salary.route.js";
import companyRoute from "./routes/company.route.js";
import companySizeRoute from "./routes/companySize.route.js";
import jobRoute from "./routes/job.route.js";
import savedJobRoute from "./routes/savedJob.route.js";
import applicationRoute from "./routes/application.route.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/skills", skillRoute);
app.use("/api/levels", levelRoute);
app.use("/api/positions", positionRoute);
app.use("/api/salaries", salaryRoute);
app.use("/api/companies", companyRoute);
app.use("/api/companySize", companySizeRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/saved-jobs", savedJobRoute);
app.use("/api/applications", applicationRoute);

app.listen(8800, () => {
    console.log("Server is running!");
});
