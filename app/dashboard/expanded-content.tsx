import { Activity, TrendingUp, BarChart3, UserCircle, ArrowUp, ArrowDown } from 'lucide-react'

export type BoxId = 'pageViews' | 'totalRevenue' | 'bounceRate' | 'salesOverview' | 'totalSubscriber'

interface ExpandedContentProps {
  boxId: BoxId
  title: string
  value: string
  change: string
  changeType: 'up' | 'down'
  iconBg: string
}

export function renderExpandedContent({ boxId, title, value, change, changeType, iconBg }: ExpandedContentProps) {
  switch (boxId) {
    case 'pageViews':
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${iconBg} rounded-lg flex items-center justify-center`}>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-5xl font-bold text-gray-900">{value}</p>
                  <div className="flex items-center gap-2 text-xl">
                    <span className={`${changeType === 'up' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {change}
                    </span>
                    {changeType === 'up' ? (
                      <ArrowUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Unique Visitors</p>
              <p className="text-3xl font-bold text-gray-900">8,342</p>
              <p className="text-sm text-green-600 mt-2">+12.3% from last month</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Avg. Session Duration</p>
              <p className="text-3xl font-bold text-gray-900">4:32</p>
              <p className="text-sm text-green-600 mt-2">+8.1% from last month</p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Views Over Time</h3>
            <div className="h-64 flex items-end justify-between gap-3">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => {
                const heights = [45, 55, 60, 50, 65, 70, 75, 80, 85, 90, 88, 95]
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t" style={{ height: `${heights[index]}%` }}></div>
                    <p className="text-xs text-gray-500 mt-2">{month}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )

    case 'totalRevenue':
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${iconBg} rounded-lg flex items-center justify-center`}>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-5xl font-bold text-gray-900">{value}</p>
                  <div className="flex items-center gap-2 text-xl">
                    <span className={`${changeType === 'up' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {change}
                    </span>
                    {changeType === 'up' ? (
                      <ArrowUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Today</p>
              <p className="text-2xl font-bold text-gray-900">$124.50</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">This Week</p>
              <p className="text-2xl font-bold text-gray-900">$892.30</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">This Month</p>
              <p className="text-2xl font-bold text-gray-900">$3,542.80</p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Breakdown by Source</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Product Sales</span>
                    <span className="text-sm font-semibold text-gray-900">$2,145.20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '62%' }}></div>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Services</span>
                    <span className="text-sm font-semibold text-gray-900">$892.40</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '26%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Subscriptions</span>
                    <span className="text-sm font-semibold text-gray-900">$505.20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-400 h-2 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-gray-900 mb-2">{value}</p>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'bounceRate':
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${iconBg} rounded-lg flex items-center justify-center`}>
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-5xl font-bold text-gray-900">{value}</p>
                  <div className="flex items-center gap-2 text-xl">
                    <span className={`${changeType === 'up' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {change}
                    </span>
                    {changeType === 'up' ? (
                      <ArrowUp className="w-6 h-6 text-green-600" />
                    ) : (
                      <ArrowDown className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Avg. Time on Page</p>
              <p className="text-3xl font-bold text-gray-900">2:18</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Pages per Session</p>
              <p className="text-3xl font-bold text-gray-900">3.4</p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bounce Rate by Device Type</h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Desktop</span>
                  <span className="text-sm font-semibold text-gray-900">72.3%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-600 h-3 rounded-full" style={{ width: '72.3%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Mobile</span>
                  <span className="text-sm font-semibold text-gray-900">94.8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-500 h-3 rounded-full" style={{ width: '94.8%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Tablet</span>
                  <span className="text-sm font-semibold text-gray-900">81.2%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-orange-400 h-3 rounded-full" style={{ width: '81.2%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )

    case 'salesOverview':
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              <div className="flex items-center gap-3">
                <p className="text-5xl font-bold text-gray-900">{value}</p>
                <div className="flex items-center gap-2 text-xl">
                  <span className="text-green-600 font-medium">{change}</span>
                  <ArrowUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-lg text-gray-500 mt-2">+ $143.50 increased</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">This Quarter</p>
              <p className="text-3xl font-bold text-gray-900">$28,542.30</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Last Quarter</p>
              <p className="text-3xl font-bold text-gray-900">$24,890.12</p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Sales by Region (Last 6 Months)</h3>
            <div className="h-64 flex items-end justify-between gap-4 mb-6">
              {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'].map((month, index) => {
                const heights = [70, 45, 90, 65, 80, 75]
                return (
                  <div key={month} className="flex-1 flex flex-col items-center">
                    <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t" style={{ height: `${heights[index]}%` }}></div>
                    <p className="text-xs text-gray-500 mt-2">{month}</p>
                    <p className="text-xs font-medium text-gray-700 mt-1">
                      ${[2988.20, 1765.09, 4005.65, 3245.80, 3890.45, 3562.32][index]}K
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                <span className="text-gray-600">China</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-indigo-400 rounded"></div>
                <span className="text-gray-600">EU</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-gray-600">USA</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-500 rounded"></div>
                <span className="text-gray-600">Canada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-teal-300 rounded"></div>
                <span className="text-gray-600">Other</span>
              </div>
            </div>
          </div>
        </div>
      )

    case 'totalSubscriber':
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${iconBg} rounded-lg flex items-center justify-center`}>
                <UserCircle className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-5xl font-bold text-gray-900">{value}</p>
                  <div className="flex items-center gap-2 text-xl">
                    <span className="text-green-600 font-medium">{change}</span>
                    <ArrowUp className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <p className="text-lg text-gray-500 mt-2">+ 749 increased this week</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">New This Week</p>
              <p className="text-3xl font-bold text-gray-900">749</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Active Now</p>
              <p className="text-3xl font-bold text-gray-900">18,542</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Churned</p>
              <p className="text-3xl font-bold text-gray-900">142</p>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscriber Growth (Last 7 Days)</h3>
            <div className="h-64 flex items-end justify-between gap-3">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
                const heights = [30, 45, 90, 50, 60, 40, 55]
                const values = [2450, 3120, 3874, 2890, 3456, 2765, 3012]
                const isHighlight = day === 'Tue'
                return (
                  <div key={day} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full rounded-t ${isHighlight ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' : 'bg-gray-300'}`}
                      style={{ height: `${heights[index]}%` }}
                    >
                      {isHighlight && (
                        <div className="text-white text-sm font-medium p-2 text-center">{values[index]}</div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{day}</p>
                    {!isHighlight && (
                      <p className="text-xs font-medium text-gray-700 mt-1">{values[index]}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )

    default:
      return null
  }
}

