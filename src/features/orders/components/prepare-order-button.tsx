import { Button } from '@/components/ui/button';

type PrepareOrderButtonProps = {
    onClick: () => void
}

const PrepareOrderButton = ({ onClick }: PrepareOrderButtonProps) => {
    return (
        <Button type="button" className="cursor-pointer" onClick={onClick}>
            Prepare Order
        </Button>
    )
}

export default PrepareOrderButton