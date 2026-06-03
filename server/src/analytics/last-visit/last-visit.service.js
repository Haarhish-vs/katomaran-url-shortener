export function getLastVisitTime(recentVisitHistory) {
	return recentVisitHistory[0]?.clickedAt || null;
}
