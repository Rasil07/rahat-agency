import React, { useContext, useEffect, useCallback, useState } from 'react';
import { Table } from 'reactstrap';

import { AidContext } from '../../../../contexts/AidContext';
import AdvancePagination from '../../../global/AdvancePagination';
import { APP_CONSTANTS } from '../../../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;

const List = ({ projectId }) => {
	const { vendors_list, vendorsByAid } = useContext(AidContext);
	const [totalRecords, setTotalRecords] = useState(null);

	const onPageChanged = useCallback(
		async paginationData => {
			const { currentPage, pageLimit } = paginationData;
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT };
			await vendorsByAid(projectId, query);
		},
		[vendorsByAid, projectId]
	);

	const fetchTotalRecords = useCallback(async () => {
		const data = await vendorsByAid(projectId);
		setTotalRecords(data.total);
	}, [vendorsByAid, projectId]);

	useEffect(() => {
		fetchTotalRecords();
	}, [fetchTotalRecords]);

	return (
		<>
			<Table className="no-wrap v-middle" responsive>
				<thead>
					<tr className="border-0">
						<th className="border-0">Name</th>
						<th className="border-0">Address</th>
						<th className="border-0">Phone number</th>
						<th className="border-0">Email</th>
						<th className="border-0">Shop</th>
					</tr>
				</thead>
				<tbody>
					{vendors_list.length > 0 ? (
						vendors_list.map(d => {
							return (
								<tr key={d._id}>
									<td>{d.name}</td>
									<td>{d.address || '-'}</td>
									<td>{d.phone}</td>
									<td>{d.email}</td>
									<td>{d.shop_name || '-'}</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={2}></td>
							<td>No data available.</td>
						</tr>
					)}
				</tbody>
			</Table>

			{totalRecords > 0 && (
				<AdvancePagination
					totalRecords={totalRecords}
					pageLimit={PAGE_LIMIT}
					pageNeighbours={1}
					onPageChanged={onPageChanged}
				/>
			)}
		</>
	);
};

export default List;
