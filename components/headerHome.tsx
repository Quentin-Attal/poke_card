import { IconButton, InputBase, Paper } from "@mui/material";
import { Search as SearchIcon } from '@mui/icons-material';
import Image from "next/image";
import type { HeaderHome } from "../type";

const HeaderPageHome = ({ search, setSearch, handleSearchSubmit }: HeaderHome) => <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    marginBottom: "20px",
    gridColumn: "1 / -1",
}}>
    <Image
        priority
        src="/images/rotom.jpg"
        height={108}
        width={300}
    />
    <Paper
        component="form"
        sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
    >
        <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search your pokemon"
            inputProps={{ 'aria-label': 'search your pokemon' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                    handleSearchSubmit();
                    e.preventDefault();
                }
            }}
        />
        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearchSubmit}>
            <SearchIcon />
        </IconButton>
    </Paper>
</div>

export default HeaderPageHome;