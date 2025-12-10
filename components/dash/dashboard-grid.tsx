import {LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardItem {
    icon: LucideIcon
    title: string
    count: number
    iconColor: string
    bgColor: string
}

interface DashboardGridProps {
    items: DashboardItem[]
    showViewMore?: boolean
}

export default function DashboardGrid({ items}: DashboardGridProps) {
    return (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    {items.map((item, index) => {
                        const IconComponent = item.icon
                        return (
                            <Card key={index} className="hover:shadow-md transition-all duration-200 cursor-pointer border-0 shadow-sm hover:scale-102" >
                                <CardContent className="p-3">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${item.bgColor}`}>
                                            <IconComponent className={`h-4 w-4 ${item.iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900 truncate">
                                                {item.title}
                                            </h3>
                                            <p className="text-lg font-bold text-gray-700">
                                                {item.count.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
    )
}

