interface ClickyCardProps {
    children: React.ReactNode
    type: "primary" | "secondary" | "tertiary"
}

export const ClickyCard = ({ children, type }) => {

    return (
        <div className={`flex items-center rounded-2xl hover:shadow-[0_10px_0_0] hover:shadow-${type} hover:-translate-y-2 shadow-none duration-300`}>
            {children}
        </div>
    )

}