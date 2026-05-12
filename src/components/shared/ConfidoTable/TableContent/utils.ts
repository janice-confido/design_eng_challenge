import { SxProps, Theme } from '@mui/material'
import { ColumnPinnedState, InnerTableColumn } from '../TableColumns'
import { ValidRowModel } from '../types'
import { colors } from '../../tokens'

export const constructColumnStyle =
  <R extends ValidRowModel>(
    styleProps: InnerTableColumn<R>['style'],
    pinned: ColumnPinnedState,
    isHeader: boolean = false
  ): SxProps<Theme> =>
  (theme: Theme) => {
    let style: object = {
      width: styleProps?.width,
      textAlign: styleProps?.align,
      bgcolor: styleProps?.backgroundColor ?? (isHeader ? colors.charcoal50 : theme.palette.background.paper),
    }
    if (pinned === ColumnPinnedState.UNPINNED) return style
    style = { ...style, position: 'sticky', zIndex: isHeader ? 3 : 1 }
    if (pinned === ColumnPinnedState.RIGHT) return { ...style, right: 0 }
    return { ...style, left: 0 }
  }
