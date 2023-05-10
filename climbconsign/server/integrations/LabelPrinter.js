const Dymo = require('dymojs'),
// dymo = new Dymo();

// Initialize Printer
dymo = new Dymo({
    hostname: process.env.DYMO_PRINTSERVICE_IP,
    printerName: process.env.DYMO_NAME,
    port: process.env.DYMO_PRINTSERVICE_PORT
});


exports.print = (product_id, name, size, color, lastname, firstname) => {
// FIXME ummm duh! Need price on the label lololololololololololololololol
    const description = [name, size, color].join(' ')

    var labelXml = `<?xml version="1.0" encoding="utf-8"?>
    <DieCutLabel Version="8.0" Units="twips">
        <PaperOrientation>Landscape</PaperOrientation>
        <Id>Address</Id>
        <PaperName>30252 Address</PaperName>
        <DrawCommands>
            <RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270" />
        </DrawCommands>
        <ObjectInfo>
            <BarcodeObject>
                <Name>BARCODE</Name>
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
                <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
                <LinkedObjectName></LinkedObjectName>
                <Rotation>Rotation0</Rotation>
                <IsMirrored>False</IsMirrored>
                <IsVariable>True</IsVariable>
                <Text>${product_id}</Text>
                <Type>Code128B</Type>
                <Size>Small</Size>
                <TextPosition>None</TextPosition>
                <TextFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
                <CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False" />
                <TextEmbedding>None</TextEmbedding>
                <ECLevel>0</ECLevel>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <QuietZonesPadding Left="0" Top="0" Right="0" Bottom="0" />
            </BarcodeObject>
            <Bounds X="1738.17883300781" Y="129.576156616211" Width="2964.17211914063" Height="528.827819420012" />
        </ObjectInfo>
        <ObjectInfo>
            <TextObject>
                <Name>NAME_TEXT</Name>
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
                <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
                <LinkedObjectName></LinkedObjectName>
                <Rotation>Rotation0</Rotation>
                <IsMirrored>False</IsMirrored>
                <IsVariable>True</IsVariable>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <TextFitMode>ShrinkToFit</TextFitMode>
                <UseFullFontHeight>True</UseFullFontHeight>
                <Verticalized>False</Verticalized>
                <StyledText>
                    <Element>
                        <String>${lastname}, ${firstname}</String>
                        <Attributes>
                            <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
                            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
                        </Attributes>
                    </Element>
                </StyledText>
            </TextObject>
            <Bounds X="1740.24499511719" Y="1147.58276367187" Width="3026.54296875" Height="255.417221069336" />
        </ObjectInfo>
        <ObjectInfo>
            <ImageObject>
                <Name>EDGE_LOGO</Name>
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
                <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
                <LinkedObjectName></LinkedObjectName>
                <Rotation>Rotation0</Rotation>
                <IsMirrored>False</IsMirrored>
                <IsVariable>False</IsVariable>
                <Image>iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAACfUExURf///yQeIAAAACIcHiIfIBEFCpqYmR8YGggAACQdH/v7+xkRFOXl5SIbHh4cHR4XGd/f3/T09Ovr69vb2xcOEQ8AB7Oys9TU1L28vPb29oeHhwwAAMzMzBkXGF1cXGlnaMXFxXBwcDUxM3t5eqenpyclJkJBQVNRUqCenxEOEKGhoTs5OiwqK0tJSnZ2dq6trVhWV4WCg4+Pjy8vL2VhYrkEvjQAAAAJcEhZcwAADsMAAA7DAcdvqGQAABrKSURBVHhe7Z2JlrK4EoDtAgRBQRF3aXdtXFvb93+2W5UEBAQJ9jIz9/jdc8f+FYGQSm2pxMqLFy9evHjx4sWLFy9evHjx4sWLFy9evPhr6t35rif+/n+kugdDd+Ai/vn/xwcob4gK6251LN77f6A3X80Xy3HbbQK1j5rojzqwWO7WH01xzH+aJfgN3RsBIhrIqHkd3ekALMVh/z3cVrPbrG631ZWtUotU9t87FFh/TMVX/lO4B+wyAzqdjtYQbclD1+AsvvUfou1Z4v6l0Fbz3Wayrbvi6/96mhco6rgUiqI7Fg7KyX9Cw04/IVBKdeENH3ZLU5zn30p/B44DwWQv7rkcqqqPYNEW5/o30l+DbqM9HzQNcc9P4MGmL873bwP7T6919nR7R0/c7lOgEFz+hVqni/33psOZxtEAsq2fNIr2b9M6bvUN21cb7fgY2hrfbCFiwX7ZYmf7FzCeQEdBbzMKGvbMw/4uyj+vdVotEsnuHKwa3pAxD29nmvBAv4EawKErTvoP0FsDBIvuHsUT1bwV872uT5rDe1TUOv6lLs77x/TAQUHyRiSQ+Kzfb/Lk/lQXclDrvP+1c149LpuVza2jPJjEx8slEO//GBZ8bf9S60wBw729SmOPqPnHhBiZzo/omSTo61TF+f+AjY+X5FEfoezF+4LuzwppiO0vxAV+nXa6BZBMnh1wfP4Knb/I0jWrn4omLhgBCTfy7gH8HMap8suRR/0KWsYgMxIma/Etl/Qx1kr9GpqVX1M6Vci2cxDX5a3f60JEURTNB4BZ/zc882vevUP8asuRePfXICGyACY/7QeYu7vxJ3DW4hBywGerXzAVmVjwuT73KvUfG5mHnOHlQSSk5tYYWX/VQMTRPZgb6+3PtPGa1YOqbcB5zGV00J8A8+D+lsab9fYjimeYOQZ9e8kHg9mfaaiGGn/ZgyHWjzgCp4wG6uDN2dPD5gFYtj2C+XX9DzQRZuwev0UPQh/0hvPZPmADsXkGGREFVlsU158JfcuhwrfzHS07676NbcXtXrH3sPXKyGYzLP1fNYZ36Do5x6r99V1ds0lFQ77PvG7DBoO5ABgdVvk1fs0lvaOmBAC7TWCTdAXr79n/Sypx5rxPmGJVbfZPNEwLcYFfdEmToMFfDQc4Rg621YGO6idd45JM04Ow81HZRLk0O4DPKPr9TZf0BrbnOm6GgjlouVtQbThig5/DDdKDENBCXFmzFXyWs1tE0zLuFVIGjuFJHZdHMEnLZBdsNdg/qW/MXdrbtib0/gW0DviTfvzJybmkMG0uYKSLf5WnkQq4iTE2UQeMOp7g/U7wgAtle7iN52aIvcycWmOFRw6WXzlxSjFWlvlrB6gUtH35soBBWo3iaY7iszvGMnpG1T7E0TyLLN4uA2RlUOv0ePVEHCeDu7vrQcUiuaxPTx/VbT/5yCaUvilChciLdKsWyHwlDR8mcXrn9deKPlJK6lQXvdo06D+QDwojTesYoMZGtys1GxMkZKy/Aa+0F6RASm1OwNNFYkwt1UR3dW+//cnFgpt/7dCgElTz4scEqaxVpTkEo4zWwUsbKVf7Eh8dNdL0kgy+MnSB6ieNR+x8hUUXhHMQR98wT2tZrdPwYA+wSXUhCM+D493JcC6ZEWEaiIainEuaqSUqvRl07JyCmxiOdZ5W3DsHjdRojNtAL2Apd8fR9TYyLqnSEUenaX3sC7XOaCcOTlFN6vtk5i+fFi+yK0CPLhrVrD1Ee1CVOH1/qHUUOOdYu2GyhfeqNpuZjIupBtEdy7mkj9VAfejTTF02Rq6pm6U6H8T7j6lLdYkq/BtUF1LHW1dxeB5mdw3ZTmvDEofccWel0uo6m6GU6tejPKKkSyrhHLePhpEWVtX3IFf27jRiZys+echdQBFD0ULlbpzE4ZWdjE3L8pkzaG3nKfNhH1r9XK+6ns7QZjquaXJDWRWDs7ftmd9Aww8vm+uSOjwdwJGvJZ1eQbtN373Zt5xzBu8pLe68iw8eccorabJgjcpYWAZtKA6vTHJMtnOd3LpDCUoEqe7FBicckbfxnsUlJaa3sfOAlIkRKBqPdweixyLN6Gbk4hh4Z030GrkYeSXLSGNOq3No5WvhtMApqkScmDIxRM2CfZXbdyGTViQNuS4pU2v1s2GQR2eUDsKb+E0+wH2AdV4bTT3pL6qJmaIcUrUGiqOBMYtu8IPL8E0zqjl6ydnwzwdLVpISlC/kGpy41kGXzpuL9+5I5atVmShxmRiHnvVZHcd6ngeCNye6nxc3xUKZ/g6dJAvmyxJjkTOegcE8z/zAaJFUAzLKtBd/KlY6qp+nLvgZV5hxQid4QI+nazk0ldMpX8jlVlXymEKJSDM4pTPtMhFUXHWkdVOLeR12FBrmuaSq/yWOmF27ODQGc3rUigeHroQqSMJUcqZG7S3gzkOQ6cRz3M1MhTy85Olm3BLHxrC/Qr/8DEBtcmvcyjiglC4f7b5DTLVF9NHLY+dM0JCIoPqJgZj09FifKVp4koGWo2eiJ9kbvRlMDbu+OPSZQi600emioTGVtGYxKvYtPhKSpwRxwWbGwotSCbneQaRrtx3lrcceUvfmvvow/5CNVTk1pZZQNs333EjE+RTH5DPkUxMhuh27mS416dateS6pEmr3rt5QFPrDdIc3kVJVuxNPmBfzMcIgMbI37uJR7qM4gjp3k9GFFcuv0Ljjt0wk1G4cL1TBGGpaE+6jh/6r4gdBYOnMCZTWOi00SjVDPJMPI2f0c4oH4uVS2SUcWu0WvVCneVHom+eS3lS2pUQCK4Yw7DezxXFyGGkN3YChbKZ6gX6IAvSs+qs7/ZlAMfg3HtDfTW2m3COiCmemSiNpya0lFXpmYHbx0YePlARD1y+hbq5fNLDRfLzLJTm5uMBusStYk6P6xeGFuYbzYB3vRTW0GaRZlChuqnbE52lCpdBVbTWyqO8WhlxxATK7c7xtNB/C5X0Mn4C1gzwFE6IGEpWadZ+eWXwshqP8HX22WzpilUzlhajGeMJDberkKJ1z9lSIlLBo04k6ROnIrD6QruuU8UyphePJR1wcbOZTsLRIJ7Q3eS5pgO04MlWzxE6OFO9a9w9h759hd2BOapMlFDC0LnZarcfSGSGTM22rGGnPKtNYFlO1ySyeaPo3uuW8LCmT0SoFhGjkIx/dhcYqbARaXF3k5/sdekyK7hSuPqiGc7COobEb0zMVTtrPzGSMB/WxE+qrmFb27TobC7XwGTXzQl+N9VT/6FZx1EZqqapFJpuVMFrCMO9R1PX5IQBPg8MjrWPOR9iLegDrk4laS4fDLqtXZWLtsb2qV7p04AAdwhDVX7HkfY25mUieSxo+gsEBZQBCw9gKnCgXxRYsiKYPAhtdSbdijhcaeA9XHwyGe4DdhezLQIF5/y5Jw5BJe0P3squceB5mG5NUhatO4QObuSk5fce7wjzvIFpROLGinDcLWpU3/o86DmaNaz+ze4AggOsDTWGGp5uSMphlmWOJ6Km/rphQWYr7ae/SJkENNnSdB7oNBUjcZS9MKlThpuOY5/f2dmTDjlpoRLqhN6M2KpLBR1auXQnEhw9Al6YFlY/IcTnfzWJ4a7ylh1lSB/bcI7vw7sQG3iZyavx8HqwvJiXLEhFdHUM+GV1BxDzdCImZi9auiw+2Ur3ZzbGePpPv13NdUgF6ZDNsUov0ibnAgxthT9FqFI8eT803fJKQ1MhxJxIjiZGlCSRip9PKJGV6iR3ZukI0wcf/0O1NkW9BnTTp1jeXZXdOzkPUU2sdY70daHQChf4TmZ+TpHSGZLXwYXaVM5hvTotZ5Rwl7YltNNeq+qyejd1aIRaAHxi8fiYchqalUGPbl2j2N5ymuwAcZR1xRsY4vLmUDzC7x4VbWSRN0zgcjP51OgHITBpnoBL8z3CAoHg7/Ny9ichC+FwsVwp1e4moMWOZnET4GzJJ6ey2J8wrioE5rWbIRwbxsmHFIhkcDNBY1xbiPgZnCxtlNYBquVj8WLMiPVwMynsaYXhk+Ez7wqHQj+gcubMxCayrZ0RGWeQDXVQ0tQAdX8bZ84bjCSgWjkWTLTUgH1V8WMQgzPzEiFyoYjZpaQmtA7Oon1m2No3ioe07gCfkVFy8DpYWBmNttJIosePAcfx6OBBqMol5Iis8TZfbPOCQ0klbcTqNvLkyE/eU02QPx97zdm0nw/Dp4YNizal/Bafj4aAx58ISpWGFZAiSnpv9v2eX1Gphm3SWC86YvLlHDf2ngZj1VG7hIWcKof4Rs0vkGLyNElr8AR+JbBKjzBTXKikqB+GectuVrNPJIZ5NwLGGbqwaLBKyv3ZqUU3OZEGNRE9TMWQtxvxe0chWmxBGQqDDYJenZSn7Ukwy1narOjiqB6ubksZQJfLGXYwrNi1TVTTp5aLJtC7nVsRUCPreccTj8rg+TORw8mC1pAnYrGcDzcGyx8zyXtejgIrmci3/PQgukRdeQDcjPLVtCXsvSLZQzLQqDXb5IpeUM8pQGM1zB7UOhvP6ZuliFxqRW8FmkGw/uzAsi8yFPH7ODFUWg0QLP3gEJeROamePyNFOMjjtIFDfFGylV1ODUKhCRSYzNVZp9U6LVTqmY/hFNTsxXF38weCZX1H5J7eMMhESJaACYe4f2fvwKUyhw8ZBocGudxc7DYxUwV5ImT5sJirlvtgJhSUWHVpAFDBk4Fb33Ou2NmGftbY7dA3sRD71jt7wCwwWeOVg59T3ZTGOPw1eW9URem//4BIRt7K+bKafQI6uE9uuoHcEeFBW1BuuIKfrImy5siTGNC7RzFYoHrcfcjt7FKsMXqqHHuk62qelVX3PcrrM3va4A6o+iaLUHJQ3eV3ajw8jli3oCDv1LuOS3iqmHkCletgrOgSzBwqmN/NBs/SczGUSpSbfwlPc/SFVrggXQK5w0Ysqph7TOxqjhmqjtd9mN3J8AEsp6rqIMm7pLRElVHnofUjt7BG5pMW0tivSOmg97iehBt0N7aEiT17FRhbDWJqG2Qpxz5TALcaXj7QRKtVDrTNKGrNB/wq36FKOfBN1zyJy8M0rsw7CVMjNAMlM/6CKHocG370E4MRtodmf0NrispSI8CuzUGTCuQvxZalllOkNT7JxAcCphnq0f4jGUKs/gdi6jhKUCS024oGaqzCrz8RUziUN1e5j6FxKB6KSOd5WbF7nvvckdU2JHEblSwhQMwoF/TkqU7nN5mRm8JAuS1tYsIvuyz19isW3CRTNCCynUWwwSgRPFSMMgJeBeKKqv2sN7hL8WUiP9zHXJDqqUdet9y8HGGUMAh306uly/NynLq5rAJ2kMJdpYSwb1P8EXp1nfeVNqCV55JImcXcYZyAWbcMLWtYYd2AeDi4zVoOheDCv9sbbq35Lx+OVpY0Uhodx96l3YI9PtaUSwbrsxApifoZFVZkjjSr9YmpZ1LZSszvn8DFOYwmHEn3opuaolh2p3mOwohdpjvcZEVVVbUT3wFskb5mSC/icEwWO7XgLpaWnUk/re3ciu7VszZD3DYnrTTAajqexfaMxSN6r68XdKoQ6WB6sLglZPMVbKGWHGe17SZuqcpMVgaRLGmJ+sWhM1UHbf54vp2mvyfYrzKS5XqQNQnx6poQ9TARPIUcpJ6PEaOewjTfUYN4u1/ch85g2lVsxw0iEFiFSkWGJyZ8QWgeq0bTyM4SrIxiyIQ0SDy0iTJlNkkoMhYgNwPW5DkSbGm+h7OI8JD4DHOGGyvoBSiKDJclgeBc4SZOYyy8hQJHjHYdquApRdKk6vB9jGLf4j9dIJQgd7zj1R2vabih/uwuweYj5QiUyUWJL4AR3m2TkYsH8lJVS+h2a1UNox2yZVU8cP0PSpiW2m9ONIG/l7m8Q1irbqnijkNS8DGcsoWhukEv5vP4oSahQfelx2MpoYfk9hBx0sP5I6/C1Sg+Xiydphkt6Yjyxx7Nqa3D9E60jVrDJe97jDLvy5FZeGML/wd7jJo+E/ft9KXJIZLxDviSDizS6Yfz+3uN8Fwip1YeMbYZ/17LjtrUcf6B11rwwWnbyKZ4PvrG8D1alccD6Xa0jarJlOzHTaUPhlbb5GZCv84RXLg1PcWTsEJPJIVsBmvcFLKXw4Wv7e74OW5D8eG37jSBboL77owCqqozgKJ9LKQeLMtRArmYoL6XblyoVesxTC2Vl4Em3hkSdN6rN3NVfi3KzXdnQ76yUTXVIIPY5kar7y3JpBC7Xyt/kmYWyxfCdAaQGYqJMIUXrTaZQoRC2icgPmw8+LyZlL7qpGsIETam5CwkaP611eF5RqrQxthIhg3G5TdYeYbHdUn4KvlJFKqO4eHzZltiv4ifQoUShVgEt5tZIzQNnZWmSjCdgxHbJ+Q5GVBf1bdg6KKkiWpmNMt2qf9sl5zuoRvG6XUmYRyIze2mG6+8K6H8+3GRNFv2Qvw9USb7wdjK2l7gjK4eRTfP8E1rHh9Xm+COpgG0H/QmJmppemSlO+a0dH6A4HuyO78fvGkgqDJWZoM2M8POhrR2fDP/j6JYVBMPFKdro+RlQ18gEwZnTMo9oVVc/4a9SCtIzwDtE6zFK0wOpjeEKzGEm9POc3487GMp3ftn64Ch+cQhabA6zqJ+DsmVoeZQp/EkyvToy1TxS8UcGP6N1kGdvAO0cXl+iIKPE6qg0qHW+melA9KdbyIrSiifz69LTG1m0sn/RRB7V3z09DCWdmrF04jgbucKpXPyne1DMrdCiwMcsS6z/ijNd8QHwvXyVvitVcJRiT7qucCBeZNf/JRmCD/P5/utU+dYvreZvqCtD2/fxFEXP6PpcAn7nq6qtKLqhPZ38JxS/+p2UqrnT7/cJTJM1w11I/ShXMVWMMipRnXZPD2qFflv2kqw82rOP0+K0ytr97lmc9faKjXzSP12Al1w7eYd87EQ0PTAg6CTCRLEGn14QvXx4pWsWTCZvh2bFfEKvDovyW81S5tD8OH4BxH5xTbE0Vg3rsRpDZLczHLkVL3FqltWwdhMA/een5TKL9h7SanePXgeVDDVuNbn029PuZdGuE03shNNmhw+ho8nSQTTLQay3WgM2ix9OHmcW7RUyuOzn6/fqOGcMm+PTtirJB1GdHTaHFZCf6QSP1+yVZihfwfjr9LrvXNR/dJZ88mdVMFK0ms1mb/q8I5fB4Ucz7f9GopUWD2m7LWZ0BoNByzQr9V673SMSX3a37+/H4YeIZ/ErZOJM9hX+1j+DXHTIhwfHZzWwgn20d15zAqMAjaUBb6QMm+IAhnyl68/T0sQfD+HbigR0swb9yCJtzFvTF2fNV4wRz9L3wVKd3WyGR+qUYma1Z6r4yj+pzdpSyzDZSlLv3Kq3p/0TtohaSDuwVd/1tz1z7WlPB/bbhDS9Tp4mC6qMpYt6o3/6WfVfjkezozfYmvzYxr6sJAzjsl6gvCksFUSLP9i2l7QDCc0HsQzDN6LbH0MyHTzHUOK25wPvU7RarSs2jNYjmPOGeARVkktsasvG0K3M0qvfIqvgKwP3gL5nrL7vgP615mJ4hg2jNSVMJlmPue1xm/3KXnuOvlvJ5Sa/QRUjfJe5lEirVa/TXdLLoI22lwin+5rXWxRCUqrssR00l067mgwDFV9TannQW2/CoAivQcIsXugK7NXEq9ArioW4XNvEz9hd0G2xg+rTfi889aDX5/6AyQ/Cl4L5SCppi3T/pQ/s52hPAIu6eO/2+7Rm/6yuuaQyRUnSyebSseUzWnZ3v3zG7U6UT+ZSYNhAX/0Uvwq9BmCzYi5qWnqtVIS/BuDiTQBtBYNuKn1niseiw8oScoMFi2TIS6FFt/hiMuv1CCppm+3We0WZr3fLKdCGspWu4Q1dqO3fkU869QL21fqnHey+ePlUk7KkFj5gtmkGtvBIfUidOh1P++0efrKG9dK1V/5uv6NunFmsaVeLJbhJDTHn0wVF7GszsfQNXe/QIonHAUyL5vE7VXBg/ekHsMaeXxmB/bnGd/pkwBR00U3bKbAGYhezi8cSq33ewj5rYWy9xnLUMABurkmTrAUt7KFqgYZDy/ZVtuBZ2Hm08AtPN2AfRe7YQrrSJHyxdI+Ew4XwVwnwEyGvU1AbqI0/DBtb2IQGPZrBwYdqZeL573jCLtgwYHsWXyumUtRC4ZYOwxaq6gr/p1ALla/ZZMIdc7R/qhJT/cwDoCvTZtG0NoebD7fS3tHKqw4O7qr2ptq3UqSZhWderVT2k8X49CYbh84Xb6HzjtdD2Z2CvbPWlYO/VmB80fie92NQ5iaIrQ02PnTRgKk+fFQK+1DkoaIWshWsgUotxBMgzB1hP/EUS+jgIPAUGgb0myy0xJLtw0Dmg1t8fCw0QqPN6FkLUQrAZy28aDCmkZBs4RtdDiUeh0o1gB4EHwGMFx7fqRmfqdEGW2cyMfS0agv82cyD8aqohWIRd9RC64ou9SWgFuoH1FMUtNPHvItC+t1mdU8DCXUp++UEpno0elrUMvHJWzjGkJkVfKCnjk9/XBkEtKGF0whaiRaOuuTNUwthuvF3znoMrA+ZxWlDw8aHzu9hZo2W1MLKm7/aF22OoXL9F7WQyQTXNLFxyLaBhj4zKy7qkxmMJtstqu4lXpQVtFywYV/CY6VnYapoKWtGj75BX4lrmqXROCwWO6VTxRaGO2jhOOQDhlrYP40anS22cNoDhSm3mYXjdmOx9ZxNHIdNF3B09MBWY4KSic07JquFyvwyRM54BP/l2A4TIxJKFE5L6ygenC5AY5+esfJmB5sr6B3lrcOkiuDfwHuPt3Cus8XclhKww3CwT86pFuIoA5c6Ex+m7gyrB83CMK8NPrxXz4ENQ/wmjf8qatSCFoqcyJndOLYwtIfnOoYEHJTjnfiTgYPsBEbHYEt4o11WPzxwdM0wvpZzsmYDdijFFUQ9tIdo9cZ4kYWL4N9LFwx2xK5yxU/4mfDzLtroNWsqPnx2BjiQsJGfRKDYoCqgHBoa2IJkIY4FYtw90YBsnrr0pPFl3Dp1ORQYNHvNXm/s9qfj3nhMber3t93ltN/nO7Fxxof1++JiVsbs1wLavTYe7HbZV1qVaZdiEnpx6f90fP3U7ZviKn32Cb1L7+O99E49+oO+43Yvlw+uEPEi1eGFOYUDfqt0m+yDXMIuePHixYsXL168ePHixYsXL168ePHixYsX/2dUKv8DIHPmA+HGrB0AAAAASUVORK5CYII=</Image>
                <ScaleMode>Uniform</ScaleMode>
                <BorderWidth>0</BorderWidth>
                <BorderColor Alpha="255" Red="0" Green="0" Blue="0" />
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Center</VerticalAlignment>
            </ImageObject>
            <Bounds X="331" Y="220.509946305231" Width="1146.03972984466" Height="1075.54968504243" />
        </ObjectInfo>
        <ObjectInfo>
            <TextObject>
                <Name>TEXT</Name>
                <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
                <BackColor Alpha="0" Red="255" Green="255" Blue="255" />
                <LinkedObjectName></LinkedObjectName>
                <Rotation>Rotation0</Rotation>
                <IsMirrored>False</IsMirrored>
                <IsVariable>False</IsVariable>
                <HorizontalAlignment>Center</HorizontalAlignment>
                <VerticalAlignment>Middle</VerticalAlignment>
                <TextFitMode>ShrinkToFit</TextFitMode>
                <UseFullFontHeight>True</UseFullFontHeight>
                <Verticalized>False</Verticalized>
                <StyledText>
                    <Element>
                        <String>${description}</String>
                        <Attributes>
                            <Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
                            <ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
                        </Attributes>
                    </Element>
                </StyledText>
            </TextObject>
            <Bounds X="1721.32446289063" Y="738.874145507813" Width="3032.58276367188" Height="313.112579345703" />
        </ObjectInfo>
    </DieCutLabel>`

        dymo.print(process.env.DYMO_NAME, labelXml);
};