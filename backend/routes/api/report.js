const express = require("express");
const router = express.Router();
const report = require("../../models/Report");
const isValidDateFormat = require("../../../backend/utils/isValidDateFormat");
router
  //get the totalSales of one day
  .get("/totalSales/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || Date.length == 0 || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.oneDayTransaction(Date);
        if (result.length == 0) {
          res.status(204).json({ message: "no result" });
        } else {
          totalGrossSalesAmount = 0;
          totalPointsAmount = 0;
          for (let i = 0; i < result.length; i++) {
            totalGrossSalesAmount += parseFloat(result[i].totalAmount);
          }
          for (let i = 0; i < result.length; i++) {
            totalPointsAmount += result[i].pointsEarned;
          }

          salesReport = {
            totalGrossSalesAmount: totalGrossSalesAmount,
            totalPointsAmount: totalPointsAmount,
          };
          res.status(200).json(salesReport);
        }
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get("/totalProductSales/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || Date.length == 0 || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.totalProductSales(Date);
        console.log(result);
        totalProductSales = 0;
        for (let i = 0; i < result.length; i++) {
          totalProductSales += result[i].quantity;
        }
        res.status(200).json(totalProductSales);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get("/totalCost/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || Date.length == 0 || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.totalGrossSales(Date);
        console.log(result);
        totalCost = 0;
        for (let i = 0; i < result.length; i++) {
          totalCost += parseFloat(result[i].cost);
        }
        res.status(200).json(totalCost);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get("/daily_sales_report/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.dailyReportByDate(Date);
        console.log(result);

        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get("/top3SellingProduct/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.top3SellingProduct(Date);
        console.log(result);

        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get("/dailyReportRange/:Starting_Date/:Ending_Date", async (req, res) => {
    const Starting_Date = req.params.Starting_Date;
    const Ending_Date = req.params.Ending_Date;
    if (
      Starting_Date == "null" ||
      Starting_Date.length == 0 ||
      !isValidDateFormat(Starting_Date)
    ) {
      res.status(400).send({
        message: "Invalid Starting Date parameter",
      });
    } else if (
      Ending_Date == "null" ||
      Ending_Date.length == 0 ||
      !isValidDateFormat(Ending_Date)
    ) {
      res.status(400).send({ message: "Invalid Ending Date parameter" });
    } else {
      try {
        const result = await report.dailyReportByDateRange(
          Starting_Date,
          Ending_Date
        );
        console.log(result);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .get(
    "/top3SellingProductByRange/:Starting_Date/:Ending_Date",
    async (req, res) => {
      const Starting_Date = req.params.Starting_Date;
      const Ending_Date = req.params.Ending_Date;
      if (
        Starting_Date == "null" ||
        Starting_Date.length == 0 ||
        !isValidDateFormat(Starting_Date)
      ) {
        res.status(400).send({
          message: "Invalid Starting Date parameter",
        });
      } else if (
        Ending_Date == "null" ||
        Ending_Date.length == 0 ||
        !isValidDateFormat(Ending_Date)
      ) {
        res.status(400).send({ message: "Invalid Ending Date parameter" });
      } else {
        try {
          const result = await report.top3SellingProductByDateRange(
            Starting_Date,
            Ending_Date
          );
          console.log(result);
          res.status(200).json(result);
        } catch (error) {
          res.status(500).json({ message: error.message });
        }
      }
    }
  )
  .delete("/deleteRepeatedDailyReport/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || Date.length == 0 || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.deleteRepeatedDailyReport(Date);
        console.log(result);

        res.status(200).json(result);
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    }
  })
  .delete("/deleteDailyReport/:Date", async (req, res) => {
    const Date = req.params.Date;
    if (Date == "null" || Date.length == 0 || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
    } else {
      try {
        const result = await report.deleteDailyReport(Date);
        if (result.affectedRows < 1) {
          res.status(200).json({ message: "No report to delete" });
        } else {
          res.status(200).json({ message: "Report deleted" });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
      }
    }
  })
  .post("/insertReport/:Date", async (req, res) => {
    const Date = req.params.Date;

    if (Date == "null" || Date.length == 0 || !isValidDateFormat(Date)) {
      res.status(400).send({ message: "Invalid Date parameter" });
      return;
    }
    const isTodayReportGenerated = await report.dailyReportByDate(Date);
    if (isTodayReportGenerated.length >= 1) {
      res.status(201).json({ message: "Report exists" });
    } else {
      try {
        const resultOneDayTransactionPromise = report.oneDayTransaction(Date);
        const resultTotalProductSalesPromise = report.totalProductSales(Date);
        const resultTotalGrossSalesPromise = report.totalGrossSales(Date);

        const [
          resultOneDayTransaction,
          resultTotalProductSales,
          resultTotalGrossSales,
        ] = await Promise.all([
          resultOneDayTransactionPromise,
          resultTotalProductSalesPromise,
          resultTotalGrossSalesPromise,
        ]);

        let totalGrossSalesAmount = 0;
        let totalPointsAmount = 0;
        for (let i = 0; i < resultOneDayTransaction.length; i++) {
          totalGrossSalesAmount += parseFloat(
            resultOneDayTransaction[i].totalAmount
          );
          totalPointsAmount += resultOneDayTransaction[i].pointsEarned;
        }

        const salesReport = {
          totalGrossSalesAmount: totalGrossSalesAmount,
          totalPointsAmount: totalPointsAmount,
        };

        let totalProductSales1 = 0;
        for (let i = 0; i < resultTotalProductSales.length; i++) {
          totalProductSales1 += resultTotalProductSales[i].quantity;
        }

        let totalCost = 0;
        for (let i = 0; i < resultTotalGrossSales.length; i++) {
          totalCost += parseFloat(resultTotalGrossSales[i].cost);
        }

        const totalSales = salesReport.totalGrossSalesAmount;
        const totalProductSales = totalProductSales1;
        const cost_of_goods_sold = totalCost;
        const gross_profit = totalSales - cost_of_goods_sold;

        if (totalSales === null) {
          res.status(400).send({ message: "Invalid totalSales parameter" });
          return;
        } else if (totalProductSales === null) {
          res.status(400).send({
            message: "Invalid totalProductSales parameter",
          });
          return;
        } else if (cost_of_goods_sold === null) {
          res.status(400).send({
            message: "Invalid cost_of_goods_sold parameter",
          });
          return;
        } else if (gross_profit === null) {
          res.status(400).send({ message: "Invalid gross_profit parameter" });
          return;
        }

        await report.insertReport(
          Date,
          totalSales,
          totalProductSales,
          cost_of_goods_sold,
          gross_profit
        );

        res.status(200).json({ message: "Report successfully generated" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  })
  .put("/updateDailyReport/:Date", async (req, res) => {
    try {
      const Date = req.params.Date;
      if (Date === "null" || Date.length === 0) {
        return res.status(400).json({ message: "Invalid transaction ID" });
      }

      const result = await report.dailyReportByDate(Date);
      if (result.length == 0) {
        res.status(200).json({ message: "no report to update" });
      } else if (result.length == 1) {
        const reportId = await report.dailyReportByDateReturnId(Date);

        const resultOneDayTransaction = await report.oneDayTransaction(Date);
        let totalGrossSalesAmount = 0;
        let totalPointsAmount = 0;
        for (let i = 0; i < resultOneDayTransaction.length; i++) {
          totalGrossSalesAmount += parseFloat(
            resultOneDayTransaction[i].totalAmount
          );
          totalPointsAmount += resultOneDayTransaction[i].pointsEarned;
        }

        const salesReport = {
          totalGrossSalesAmount: totalGrossSalesAmount,
          totalPointsAmount: totalPointsAmount,
        };

        const resultTotalProductSales = await report.totalProductSales(Date);

        let totalProductSales1 = 0;
        for (let i = 0; i < resultTotalProductSales.length; i++) {
          totalProductSales1 += resultTotalProductSales[i].quantity;
        }

        const resultTotalGrossSales = await report.totalGrossSales(Date);
        let totalCost = 0;
        for (let i = 0; i < resultTotalGrossSales.length; i++) {
          totalCost += parseFloat(resultTotalGrossSales[i].cost);
        }

        const report_Id = reportId[0].report_id;

        const totalSales = salesReport.totalGrossSalesAmount;

        const totalProductSales = totalProductSales1;
        const cost_of_goods_sold = totalCost;
        const gross_profit = totalSales - cost_of_goods_sold;

        if (totalSales === null) {
          res.status(400).send({
            message: "Invalid totalSales parameter",
          });
          return;
        } else if (totalProductSales === null) {
          res.status(400).send({
            message: "Invalid totalProductSales parameter",
          });
          return;
        } else if (cost_of_goods_sold === null) {
          res.status(400).send({
            message: "Invalid cost_of_goods_sold parameter",
          });
          return;
        } else if (gross_profit === null) {
          res.status(400).send({
            message: "Invalid gross_profit parameter",
          });
          return;
        }

        const resultInsertReport = await report.updateReport(
          report_Id,
          totalSales,
          totalProductSales,
          cost_of_goods_sold,
          gross_profit
        );

        res.status(200).json(resultInsertReport);
      } else if (result.length > 1) {
        const deleteResult = await report.deleteRepeatedDailyReport(Date);

        const reportId = await report.dailyReportByDateReturnId(Date);

        const resultOneDayTransaction = await report.oneDayTransaction(Date);
        let totalGrossSalesAmount = 0;
        let totalPointsAmount = 0;
        for (let i = 0; i < resultOneDayTransaction.length; i++) {
          totalGrossSalesAmount += parseFloat(
            resultOneDayTransaction[i].totalAmount
          );
          totalPointsAmount += resultOneDayTransaction[i].pointsEarned;
        }

        const salesReport = {
          totalGrossSalesAmount: totalGrossSalesAmount,
          totalPointsAmount: totalPointsAmount,
        };

        const resultTotalProductSales = await report.totalProductSales(Date);
        let totalProductSales1 = 0;
        for (let i = 0; i < resultTotalProductSales.length; i++) {
          totalProductSales1 += resultTotalProductSales[i].quantity;
        }

        const resultTotalGrossSales = await report.totalGrossSales(Date);
        let totalCost = 0;
        for (let i = 0; i < resultTotalGrossSales.length; i++) {
          totalCost += parseFloat(resultTotalGrossSales[i].cost);
        }

        const report_Id = reportId[0].report_id;

        const totalSales = salesReport.totalGrossSalesAmount;

        const totalProductSales = totalProductSales1;
        const cost_of_goods_sold = totalCost;
        const gross_profit = totalSales - cost_of_goods_sold;

        if (totalSales === null) {
          res.status(400).send({
            message: "Invalid totalSales parameter",
          });
          return;
        } else if (totalProductSales === null) {
          res.status(400).send({
            message: "Invalid totalProductSales parameter",
          });
          return;
        } else if (cost_of_goods_sold === null) {
          res.status(400).send({
            message: "Invalid cost_of_goods_sold parameter",
          });
          return;
        } else if (gross_profit === null) {
          res.status(400).send({
            message: "Invalid gross_profit parameter",
          });
          return;
        }

        const resultInsertReport = await report.updateReport(
          report_Id,
          totalSales,
          totalProductSales,
          cost_of_goods_sold,
          gross_profit
        );
        console.log(resultInsertReport);
        res.status(200).json(resultInsertReport);
      } else {
        res.status(200).json({ message: "no repeated data" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
