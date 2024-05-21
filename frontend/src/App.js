import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";

import Customer from "./components/Customer";
import Cart from "./screens/Cart";
import Login from "./screens/Login";
import Home from "./screens/Home";
import Payment from "./screens/Payment";
import Report from "./screens/Report";
import ReviewModal from "./components/Modals/ReviewModal";
import ProfileReward from "./screens/Reward";
import SignUp from "./screens/SignUp";
import ProfileAccount from "./screens/Account";
import ReviewHistory from "./screens/ReviewHistory";
import TransactionHistory from "./screens/TransactionHistory";
import Layout from "./components/Layout";
import Shop from "./screens/Shop";
import UserTransactionHistoryFailed from "./screens/UserTransactionHistoryFailed";
import RequireAuth from "./components/RequireAuth";
import ManagerViewRewards from "./screens/ManagerViewRewards";
import Delivery from "./screens/Delivery";
import Unauth from "./screens/Unauth";
import PersistLogin from "./components/PersistLogin";
import ManagerLayout from "./components/ManagerLayout";
import NotFound from "./screens/NotFound";
import ManagerViewPoints from "./screens/Points";
import "tailwindcss/tailwind.css";
import Product from "./screens/Product";
import ProductManagement from "./screens/ProductManagement";
import UserTransactionReceiptPage from "./screens/UserTransactionReceiptPage";
import UserTransactionHistoryDelivering from "./screens/UserTransactionHistoryDelivering";
import UserTransactionHistoryPending from "./screens/UserTransactionHistoryPending";
import UserTransactionHistorySuccess from "./screens/UserTransacactionHistorySuccess";
import Confirmation from "./screens/Confirmation";
import Chat from "./components/Chat";
import Dashboard from "./screens/Dashboard";
import ContactUs from "./screens/ContactUs";
import ManagerInquiry from "./screens/ManagerInquiry";
import ManagerAnnouncements from "./screens/ManagerAnnouncements";
import ManagerUsers from "./screens/ManagerUsers";
import AdminProfile from "./screens/AdminProfile";
import ResetPwd from "./screens/ResetPwd";
import EmailReset from "./components/EmailReset";
import Announcements from "./screens/Announcements";
import ViewAnnouncement from "./screens/ViewAnnouncement";
import AboutUs from "./screens/AboutUs";

function App() {
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<Home />} />
				<Route path="/home" element={<Home />} />
				<Route path="shop/search" element={<Shop />} />
				<Route path="shop/:product_id" element={<Product />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/aboutus" element={<AboutUs />} />
				<Route path="/announcements" element={<Announcements />} />
				<Route
					path="/announcements/:announcement_id"
					element={<ViewAnnouncement />}
				/>
				<Route path="/contact" element={<ContactUs />} />
				<Route path="/confirmation" element={<Confirmation />} />
				<Route path="/resetPwd" element={<ResetPwd />} />
				<Route path="/emailReset" element={<EmailReset />} />
				<Route path="/unauthorized" element={<Unauth />} />

				<Route element={<PersistLogin />}>
					<Route
						element={
							<RequireAuth allowedRoles={["admin", "customer", "admin"]} />
						}>
						<Route path="/chat" element={<Chat />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/payment" element={<Payment />} />
						<Route path="/review" element={<ReviewModal />} />
						<Route path="/profile/account" element={<ProfileAccount />} />
						<Route path="/profile/reviewHistory" element={<ReviewHistory />} />
						<Route path="/profile/rewards" element={<ProfileReward />} />
						<Route
							path="/userTransactionHistoryFailed"
							element={<UserTransactionHistoryFailed />}
						/>
						<Route
							path="/userTransactionHistorySuccess"
							element={<UserTransactionHistorySuccess />}
						/>
						<Route
							path="/userTransactionHistoryPending"
							element={<UserTransactionHistoryPending />}
						/>
						<Route
							path="/userTransactionHistoryDelivering"
							element={<UserTransactionHistoryDelivering />}
						/>
						<Route
							path="/userTransactionReceiptPage/:transactionId"
							element={<UserTransactionReceiptPage />}
						/>
						<Route path="/users" element={<Customer />} />
					</Route>
				</Route>
			</Route>
			<Route element={<PersistLogin />}>
				<Route>
					<Route element={<RequireAuth allowedRoles={["admin"]} />}>
						<Route path="/admin" element={<ManagerLayout />}>
							<Route path="/admin" element={<Dashboard />} />
							<Route
								path="/admin/announcements"
								element={<ManagerAnnouncements />}
							/>
							<Route path="/admin/products" element={<ProductManagement />} />
							<Route path="/admin/inquiry" element={<ManagerInquiry />} />

							<Route path="/admin/users" element={<ManagerUsers />} />
							<Route path="/admin/voucher" element={<ManagerViewRewards />} />
							<Route path="/admin/points" element={<ManagerViewPoints />} />

							<Route path="/admin/delivery" element={<Delivery />} />
							<Route path="/admin/report" element={<Report />} />
							<Route
								path="/admin/transaction"
								element={<TransactionHistory />}
							/>
							<Route path="/admin/voucher" element={<ManagerViewRewards />} />
							<Route path="/admin/points" element={<ManagerViewPoints />} />
							<Route path="/admin/delivery" element={<Delivery />} />
							<Route path="/admin/products" element={<ProductManagement />} />
							<Route path="/admin/profile" element={<AdminProfile />} />
							<Route path="/admin/inquiry" element={<ManagerInquiry />} />
						</Route>
					</Route>
					<Route path="*" element={<NotFound />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
